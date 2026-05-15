"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Home, MapPin, X, Lock } from 'lucide-react';
import { isSubscriptionActive } from '@/lib/subscription';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';

export default function UserProperties({ user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    price: '',
    category: 'Apartment',
    location: { address: '', city: '', state: '' },
    images: [] // Only used for new uploads in this basic version, not handling image editing
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties?ownerId=${user.id || user._id}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, images: e.target.files }));
  };

  const resetForm = () => {
    setFormData({
      _id: '', title: '', description: '', price: '', category: 'Apartment',
      location: { address: '', city: '', state: '' }, images: []
    });
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const openEditForm = (property) => {
    setFormData({
      _id: property._id,
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      category: property.category,
      location: property.location,
      images: [] // Ignoring old images for simplicity
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      if (isEditing) {
        // Edit property (JSON wrapper as per endpoint logic)
        const payload = {
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          location: formData.location
        };

        const res = await fetch(`/api/properties/${formData._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          fetchProperties();
          resetForm();
        } else {
          alert('Failed to update property');
        }
      } else {
        // Add new property (FormData to handle file uploads)
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('location.address', formData.location.address);
        data.append('location.city', formData.location.city);
        data.append('location.state', formData.location.state);

        if (formData.images) {
          for (let i = 0; i < formData.images.length; i++) {
            data.append('images', formData.images[i]);
          }
        }

        const res = await fetch('/api/properties', {
          method: 'POST',
          body: data,
        });

        if (res.ok) {
          fetchProperties();
          resetForm();
        } else {
          alert('Failed to add property');
        }
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSubmitLoading(false);
    }
  };

  const [deleteModalId, setDeleteModalId] = useState(null);

  const handleDelete = async (id) => {
    setDeleteModalId(id);
  };

  const confirmDelete = async () => {
    if (!deleteModalId) return;
    try {
       const res = await fetch(`/api/properties/${deleteModalId}`, { method: 'DELETE' });
       if (res.ok) {
         fetchProperties();
         toast.success("Property deleted successfully");
       } else {
         toast.error("Failed to delete property");
       }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setDeleteModalId(null);
    }
  };

  const router = useRouter();
  
  if (loading) {
    return <LoadingState />;
  }

  const isActive = isSubscriptionActive(user);

  return (
    <div className="bg-[#030711] rounded-2xl shadow-sm border border-[#12131f] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Properties</h2>
        {!isFormOpen && (
          <button 
            onClick={() => {
              if (!isActive) {
                toast.error("Your subscription has expired. Please renew to list properties.");
                return;
              }
              router.push('/add-property');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isActive ? 'bg-[#802BB1] text-white hover:-translate-y-0.5 shadow-lg shadow-[#802BB1]/20' : 'bg-[#1c2143] text-slate-500 cursor-not-allowed'}`}
          >
            {isActive ? <Plus className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            Add Property
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="mb-8 bg-[#0d0f1b] p-6 rounded-xl border border-[#1c2143]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Property' : 'Add New Property'}
            </h3>
            <button onClick={resetForm} className="text-slate-500 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-[#1c2143] bg-[#030711] text-white focus:border-[#802BB1] focus:ring-1 focus:ring-[#802BB1] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-[#1c2143] bg-[#030711] text-white focus:border-[#802BB1] focus:ring-1 focus:ring-[#802BB1] outline-none transition-all">
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Room">Room</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea required rows="3" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-[#1c2143] bg-[#030711] text-white focus:border-[#802BB1] focus:ring-1 focus:ring-[#802BB1] outline-none transition-all"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Price / Month</label>
                <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-[#1c2143] bg-[#030711] text-white focus:border-[#802BB1] focus:ring-1 focus:ring-[#802BB1] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">City</label>
                <input required type="text" name="location.city" value={formData.location.city} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-[#1c2143] bg-[#030711] text-white focus:border-[#802BB1] focus:ring-1 focus:ring-[#802BB1] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">State</label>
                <input required type="text" name="location.state" value={formData.location.state} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-[#1c2143] bg-[#030711] text-white focus:border-[#802BB1] focus:ring-1 focus:ring-[#802BB1] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                <input required type="text" name="location.address" value={formData.location.address} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-[#1c2143] bg-[#030711] text-white focus:border-[#802BB1] focus:ring-1 focus:ring-[#802BB1] outline-none transition-all" />
              </div>

              {!isEditing && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Upload Images (Required)</label>
                  <input required={!isEditing} type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 rounded-lg border border-[#1c2143] bg-[#030711] text-white" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl font-bold text-slate-300 bg-[#1c2143] hover:bg-[#2a3158] transition-colors">
                Cancel
              </button>
              <button disabled={submitLoading} type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#802BB1] hover:bg-[#6a1f9a] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#802BB1]/20">
                {submitLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {isEditing ? 'Save Changes' : 'Publish Property'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!isFormOpen && properties.length === 0 ? (
        <EmptyState 
          icon={Home}
          title="No properties listed"
          description="You haven't added any rental properties yet. Click the Add Property button above to get started."
        />
      ) : (
        <div className="space-y-4">
          {!isFormOpen && properties.map(property => (
            <div key={property._id} className="border border-[#1c2143] rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center hover:shadow-xl hover:shadow-[#802BB1]/10 hover:border-[#802BB1]/30 transition-all bg-[#0d0f1b]">
              <div className="h-24 w-24 bg-[#030711] rounded-xl overflow-hidden flex-shrink-0">
                <img src={property.images[0]?.url || 'https://placehold.co/200x200/1e293b/ffffff?text=No+Image'} alt={property.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-white">{property.title}</h3>
                  <p className="font-bold text-[#802BB1]">₹{property.price}/mo</p>
                </div>
                <div className="flex items-center text-slate-400 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1 text-slate-500" /> {property.location.city}, {property.location.state}
                </div>
                <div className="inline-block px-2.5 py-1 bg-[#030711] border border-[#1c2143] text-slate-300 text-xs font-bold rounded-lg uppercase tracking-wider">
                  {property.category}
                </div>
              </div>
              <div className="flex w-full md:w-auto gap-2 justify-end">
                <button 
                  onClick={() => {
                    if (!isActive) {
                      toast.error("Your subscription has expired. Please renew to edit properties.");
                      return;
                    }
                    router.push(`/dashboard/edit-property/${property._id}`);
                  }}
                  className={`p-2 rounded-lg transition-colors ${isActive ? 'text-slate-400 hover:text-[#802BB1] hover:bg-[#802BB1]/10' : 'text-slate-600 cursor-not-allowed'}`}
                  title="Edit Property"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    if (!isActive) {
                      toast.error("Your subscription has expired. Please renew to delete properties.");
                      return;
                    }
                    handleDelete(property._id);
                  }}
                  className={`p-2 rounded-lg transition-colors ${isActive ? 'text-slate-400 hover:text-red-500 hover:bg-red-500/10' : 'text-slate-600 cursor-not-allowed'}`}
                  title="Delete Property"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalId(null)}
              className="fixed inset-0 bg-[#030711]/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-[#0d0f1b] rounded-3xl p-8 shadow-2xl z-50 border border-[#1c2143]"
            >
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-center text-white mb-3">Delete Property?</h3>
              <p className="text-center text-slate-400 mb-8">Are you sure you want to delete this property? This action cannot be undone.</p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-slate-300 bg-[#1c2143] hover:bg-[#2a3158] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
