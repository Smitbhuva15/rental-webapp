"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Home, MapPin, X } from 'lucide-react';

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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
       const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
       if (res.ok) {
         fetchProperties();
       } else {
         alert('Failed to delete property');
       }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading properties...</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Properties</h2>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:-translate-y-0.5 transition-transform"
          >
            <Plus className="w-5 h-5" /> Add Property
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="mb-8 bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Property' : 'Add New Property'}
            </h3>
            <button onClick={resetForm} className="text-slate-500 hover:text-slate-800 dark:hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Room">Room</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea required rows="3" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price / Month</label>
                <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                <input required type="text" name="location.city" value={formData.location.city} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State</label>
                <input required type="text" name="location.state" value={formData.location.state} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                <input required type="text" name="location.address" value={formData.location.address} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>

              {!isEditing && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upload Images (Required)</label>
                  <input required={!isEditing} type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                Cancel
              </button>
              <button disabled={submitLoading} type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                {submitLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {isEditing ? 'Save Changes' : 'Publish Property'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!isFormOpen && properties.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
          <Home className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No properties listed</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't added any rental properties yet. Click the button above to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {!isFormOpen && properties.map(property => (
            <div key={property._id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
              <div className="h-24 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                <img src={property.images[0]?.url || 'https://placehold.co/200x200/1e293b/ffffff?text=No+Image'} alt={property.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{property.title}</h3>
                  <p className="font-bold text-primary">${property.price}/mo</p>
                </div>
                <div className="flex items-center text-slate-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" /> {property.location.city}, {property.location.state}
                </div>
                <div className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg uppercase tracking-wider">
                  {property.category}
                </div>
              </div>
              <div className="flex w-full md:w-auto gap-2 justify-end">
                <button 
                  onClick={() => openEditForm(property)}
                  className="p-2 text-slate-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Edit Property"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(property._id)}
                  className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Property"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
