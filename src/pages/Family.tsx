import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Plus, Users, Trash2, CreditCard as Edit, X, Calendar, Mail, Phone } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  date_of_birth: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
}

export default function Family() {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    date_of_birth: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    fetchFamilyMembers();
  }, [user]);

  const fetchFamilyMembers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const dataToSubmit = {
        ...formData,
        user_id: user.id,
        email: formData.email || null,
        phone: formData.phone || null,
        notes: formData.notes || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('family_members')
          .update(dataToSubmit)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('family_members').insert([dataToSubmit]);

        if (error) throw error;
      }

      setShowAddModal(false);
      setEditingId(null);
      resetForm();
      fetchFamilyMembers();
    } catch (error) {
      console.error('Error saving family member:', error);
      alert('Failed to save family member. Please try again.');
    }
  };

  const handleEdit = (member: FamilyMember) => {
    setFormData({
      name: member.name,
      relationship: member.relationship,
      date_of_birth: member.date_of_birth,
      email: member.email || '',
      phone: member.phone || '',
      notes: member.notes || '',
    });
    setEditingId(member.id);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this family member? This will also delete all associated prescriptions and reminders.')) return;

    try {
      const { error } = await supabase.from('family_members').delete().eq('id', id);

      if (error) throw error;
      fetchFamilyMembers();
    } catch (error) {
      console.error('Error deleting family member:', error);
      alert('Failed to delete family member. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      date_of_birth: '',
      email: '',
      phone: '',
      notes: '',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Family Members</h1>
          <p className="text-gray-600 mt-2">Manage medication profiles for your family</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Family Member</span>
        </button>
      </div>

      {familyMembers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Family Members Yet</h3>
          <p className="text-gray-600 mb-6">
            Add family members to manage their medications from your account
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Family Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-blue-600 font-medium text-sm">{member.relationship}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Age: {calculateAge(member.date_of_birth)} years
                  </span>
                </div>

                {member.email && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm truncate">{member.email}</span>
                  </div>
                )}

                {member.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{member.phone}</span>
                  </div>
                )}

                {member.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{member.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <p>DOB: {new Date(member.date_of_birth).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Family Member' : 'Add Family Member'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select relationship</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Grandchild">Grandchild</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional information..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
