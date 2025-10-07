import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Plus, Upload, FileText, Calendar, User, Trash2, CreditCard as Edit, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  doctor_name: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  prescription_image_url: string | null;
  family_member_id: string | null;
  family_member_name?: string;
}

interface FamilyMember {
  id: string;
  name: string;
}

export default function Prescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    frequency: '',
    doctor_name: '',
    start_date: '',
    end_date: '',
    notes: '',
    family_member_id: '',
    prescription_image_url: '',
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchFamilyMembers();
  }, [user]);

  const fetchPrescriptions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*, family_members(name)')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map((p: any) => ({
        ...p,
        family_member_name: p.family_members?.name || 'Self',
      }));

      setPrescriptions(formattedData || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilyMembers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('id, name')
        .eq('user_id', user.id);

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, prescription_image_url: urlData.publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const dataToSubmit = {
        ...formData,
        user_id: user.id,
        family_member_id: formData.family_member_id || null,
        end_date: formData.end_date || null,
        notes: formData.notes || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('prescriptions')
          .update(dataToSubmit)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('prescriptions').insert([dataToSubmit]);

        if (error) throw error;
      }

      setShowAddModal(false);
      setEditingId(null);
      resetForm();
      fetchPrescriptions();
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Failed to save prescription. Please try again.');
    }
  };

  const handleEdit = (prescription: Prescription) => {
    setFormData({
      medication_name: prescription.medication_name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      doctor_name: prescription.doctor_name,
      start_date: prescription.start_date,
      end_date: prescription.end_date || '',
      notes: prescription.notes || '',
      family_member_id: prescription.family_member_id || '',
      prescription_image_url: prescription.prescription_image_url || '',
    });
    setEditingId(prescription.id);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;

    try {
      const { error } = await supabase.from('prescriptions').delete().eq('id', id);

      if (error) throw error;
      fetchPrescriptions();
    } catch (error) {
      console.error('Error deleting prescription:', error);
      alert('Failed to delete prescription. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      medication_name: '',
      dosage: '',
      frequency: '',
      doctor_name: '',
      start_date: '',
      end_date: '',
      notes: '',
      family_member_id: '',
      prescription_image_url: '',
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-2">Manage your medication prescriptions</p>
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
          <span>Add Prescription</span>
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Prescriptions Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first prescription</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Prescription
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {prescription.prescription_image_url && (
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={prescription.prescription_image_url}
                    alt={prescription.medication_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {prescription.medication_name}
                    </h3>
                    <p className="text-blue-600 font-medium">{prescription.dosage}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(prescription)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prescription.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Frequency: {prescription.frequency}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Doctor: {prescription.doctor_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>For: {prescription.family_member_name}</span>
                  </div>
                </div>

                {prescription.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{prescription.notes}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  <p>Start: {new Date(prescription.start_date).toLocaleDateString()}</p>
                  {prescription.end_date && (
                    <p>End: {new Date(prescription.end_date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Prescription' : 'Add Prescription'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={formData.medication_name}
                  onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Amoxicillin"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 500mg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <input
                    type="text"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Twice daily"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
                <input
                  type="text"
                  value={formData.doctor_name}
                  onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Dr. Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Member (Optional)
                </label>
                <select
                  value={formData.family_member_id}
                  onChange={(e) => setFormData({ ...formData, family_member_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Self</option>
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescription Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.prescription_image_url ? (
                    <div className="space-y-3">
                      <img
                        src={formData.prescription_image_url}
                        alt="Prescription"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, prescription_image_url: '' })}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
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
                  {editingId ? 'Update Prescription' : 'Add Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
