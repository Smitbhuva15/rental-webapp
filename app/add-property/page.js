"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, IndianRupee, MapPin, BedDouble, Bath, Square, 
  UploadCloud, X, CheckCircle2, ChevronRight, AlertCircle,
  Wifi, Tv, Car, Wind, Shield, Coffee, Trees
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { isSubscriptionActive } from '@/lib/subscription';

const amenitiesCategories = [
  {
    title: "Bathroom",
    icon: Bath,
    items: ["Bath", "Hairdryer", "Shampoo", "Conditioner", "Body Soap", "Bidet", "Hot Water", "Shower Gel"]
  },
  {
    title: "Bedroom & Laundry",
    icon: BedDouble,
    items: ["Hangers", "Bed Linen", "Extra Pillows", "Iron", "Wardrobe", "Washing Machine", "Dryer"]
  },
  {
    title: "Entertainment",
    icon: Tv,
    items: ["TV", "Books"]
  },
  {
    title: "Heating & Cooling",
    icon: Wind,
    items: ["AC", "Ceiling Fan", "Heating"]
  },
  {
    title: "Internet & Office",
    icon: Wifi,
    items: ["Wifi", "Workspace"]
  },
  {
    title: "Kitchen",
    icon: Coffee,
    items: ["Kitchen", "Fridge", "Microwave", "Utensils", "Coffee Maker", "Toaster"]
  },
  {
    title: "Outdoor & Parking",
    icon: Car,
    items: ["Garden", "BBQ Grill", "Outdoor Furniture", "Free Parking", "Street Parking"]
  },
  {
    title: "Safety & Services",
    icon: Shield,
    items: ["Security Cameras", "First Aid Kit", "Smoke Alarm", "Pets Allowed", "Long-term stays", "Self Check-in", "Staff Available"]
  }
];

export default function AddProperty() {
  const router = useRouter();
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    city: '',
    state: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: []
  });

  const [images, setImages] = useState([]); // File objects
  const [previews, setPreviews] = useState([]); // Data URLs

  useEffect(() => {
    async function checkAuth() {
      if (!user) {
        try {
          const res = await fetch('/api/auth/me');
          if (!res.ok) throw new Error("Unauthorized");
          const data = await res.json();
          useStore.getState().setUser(data.user);
        } catch (err) {
          router.push('/login');
          return;
        }
      }
      
      const currentUser = useStore.getState().user;
      if (!currentUser || !isSubscriptionActive(currentUser)) {
        toast.error("You need an active subscription to add properties.");
        router.push('/pricing');
        return;
      }
      setAuthChecking(false);
    }
    checkAuth();
  }, [user, router]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    handleFiles(droppedFiles);
  }, [images]);

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    if (images.length + newFiles.length > 4) {
      toast.error("You can only upload exactly 4 images.");
      const allowed = newFiles.slice(0, 4 - images.length);
      newFiles = allowed;
    }

    const updatedImages = [...images, ...newFiles];
    setImages(updatedImages);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => {
      const isSelected = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: isSelected 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleNext = () => {
    // Validation
    if (currentStep === 1) {
      if (!formData.title || !formData.category || !formData.description) {
        toast.error("Please fill all basic info fields");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.price || !formData.city || !formData.state || !formData.address) {
        toast.error("Please fill all pricing & location fields");
        return;
      }
      if (!formData.bedrooms || !formData.bathrooms || !formData.area) {
        toast.error("Please fill all property details");
        return;
      }
    }
    if (currentStep === 3) {
      if (images.length !== 4) {
        toast.error(`Please upload exactly 4 images. You have uploaded ${images.length}.`);
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length !== 4) {
      toast.error("Exactly 4 images are required");
      return;
    }

    setLoading(true);
    try {
      // In a real app, upload images to Cloudinary here first
      // For now, we simulate success
      await new Promise(r => setTimeout(r, 2000));
      
      toast.success("Property listed successfully!");
      router.push('/dashboard');
    } catch (err) {
      toast.error("Failed to list property");
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const steps = [
    { title: "Basic Info", icon: Home },
    { title: "Details", icon: IndianRupee },
    { title: "Images", icon: UploadCloud },
    { title: "Amenities", icon: Trees },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 border-t border-slate-200 dark:border-slate-800 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Progress */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">List Your Property</h1>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0"></div>
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></motion.div>
            
            {steps.map((step, idx) => {
              const isActive = currentStep === idx + 1;
              const isCompleted = currentStep > idx + 1;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-950 px-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 
                    isCompleted ? 'border-blue-600 bg-white dark:bg-slate-900 text-blue-600' : 
                    'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <step.icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-sm font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-10 overflow-hidden relative">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Let's start with the basics</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Property Title</label>
                    <input 
                      type="text" 
                      value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Modern Sea-facing Apartment" 
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                    <select 
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a category</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                    <textarea 
                      rows={5}
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe what makes your property unique..." 
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Location & Details */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Pricing, Location & Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2"><IndianRupee className="h-5 w-5 text-blue-500"/> Pricing</h3>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Monthly Rent (₹)</label>
                      <input 
                        type="number" 
                        value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                        placeholder="e.g. 25000" 
                        className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2"><Home className="h-5 w-5 text-blue-500"/> Property Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bedrooms</label>
                        <input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bathrooms</label>
                        <input type="number" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Area (sqft)</label>
                        <input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2"><MapPin className="h-5 w-5 text-blue-500"/> Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">City</label>
                      <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">State</label>
                      <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Address</label>
                      <textarea rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Images */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Property Images</h2>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${images.length === 4 ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                    {images.length}/4 Images
                  </span>
                </div>
                
                <p className="text-slate-500 mb-8 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Exactly 4 images are required (Living Room, Dining Area, Bedroom, Bathroom/Exterior).
                </p>

                <div 
                  onDragOver={handleDragOver} 
                  onDrop={handleDrop}
                  className="border-3 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
                  onClick={() => document.getElementById('fileUpload').click()}
                >
                  <input type="file" id="fileUpload" className="hidden" multiple accept="image/*" onChange={handleFileInput} />
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UploadCloud className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Click or drag images here</h3>
                  <p className="text-slate-500">JPG, PNG, WEBP formats up to 5MB</p>
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {previews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-md border border-slate-200 dark:border-slate-700">
                        <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all shadow-lg"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        {idx === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">Main</div>
                        )}
                      </div>
                    ))}
                    
                    {/* Skeleton placeholders for remaining images */}
                    {[...Array(4 - previews.length)].map((_, idx) => (
                      <div key={`skel-${idx}`} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-slate-400">
                        <UploadCloud className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-xs font-medium">Required slot</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Amenities */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Amenities & Features</h2>
                  <span className="text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    {formData.amenities.length} Selected
                  </span>
                </div>
                <p className="text-slate-500 mb-8">Select all the amenities available in your property.</p>

                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {amenitiesCategories.map((category, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                          <category.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        {category.title}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {category.items.map((item, i) => {
                          const isSelected = formData.amenities.includes(item);
                          return (
                            <label key={i} className={`flex items-center p-4 rounded-xl cursor-pointer border transition-all ${isSelected ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                              <div className="relative flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  className="sr-only"
                                  checked={isSelected}
                                  onChange={() => toggleAmenity(item)}
                                />
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600'}`}>
                                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                </div>
                              </div>
                              <span className="ml-3 font-medium text-sm">{item}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 relative z-20">
            <button 
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(prev => prev - 1);
                  window.scrollTo(0, 0);
                } else {
                  router.back();
                }
              }}
              className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            
            {currentStep < 4 ? (
              <button 
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center gap-2 active:scale-95 shadow-lg"
              >
                Continue <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Publishing...</>
                ) : (
                  <><CheckCircle2 className="h-5 w-5" /> Publish Listing</>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
