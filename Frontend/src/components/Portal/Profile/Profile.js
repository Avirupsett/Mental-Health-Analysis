'use client'
import { Button } from "../../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { CalendarIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { motion } from "framer-motion"
// import { cookies } from "next/headers";

export default function Component() {
  const [profile, setProfile] = useState({
    user: {
      fullname: '',
      dateofbirth: '',
      gender: '',
      state: '',
      city: '',
      country: '',
      pincode: '',
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    async function loadProfile() {
      const data = await fetchProfile();
      setProfile(data);
      setFormData({
        fullname: data.user.fullname || '',
        dateofbirth: data.user.dateofbirth ? new Date(data.user.dateofbirth).toISOString().split('T')[0] : '',
        gender: data.user.gender || '',
        state: data.user.state || '',
        city: data.user.city || '',
        country: data.user.country || '',
        pincode: data.user.pincode || '',
        facebook: data.user.facebook || '',
        instagram: data.user.instagram || '',
        linkedin: data.user.linkedin || ''
      });
    }
    loadProfile();
  }, []);

  async function fetchProfile() {
      // const cookieStore = cookies();
      // const accessToken = cookieStore.get("wos-session")?.value;

    const res = await fetch(`/api/profile/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Cookie': `wos-session=${accessToken}`
      }
    });
    const data = await res.json();
    return data;
  }

  const updateProfile = async (e) => {
    e.preventDefault();    

    const res = await fetch(`/api/profile/update`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        // 'Cookie': `wos-session=${accessToken}`
      }
    });
    const data = await res.json();
    if(data.success){
      toast.success("Profile updated successfully");
    }else{
      toast.error("Something went wrong");
    }
  }
  const [formData, setFormData] = useState({
    fullname: profile.user.fullname || '',
    dateofbirth: profile.user.dateofbirth ? new Date(profile.user.dateofbirth).toISOString().split('T')[0] : '',
    gender: profile.user.gender || '',
    state: profile.user.state || '',
    city: profile.user.city || '',
    country: profile.user.country || '',
    pincode: profile.user.pincode || '',
    facebook: profile.user.facebook || '',
    instagram: profile.user.instagram || '',
    linkedin: profile.user.linkedin || ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-slate-50 to-slate-100 py-7 px-4 sm:px-6 lg:px-8 ">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center text-gray-800">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm md:text-base">Name <span className='text-red-500'>*</span></Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  autoComplete='name' 
                  value={formData.fullname}
                  onChange={(e) => handleChange('fullname', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-sm md:text-base">Date of Birth <span className='text-red-500'>*</span></Label>
                <div className="relative">
                  <Input 
                    id="dob" 
                    type="date" 
                    autoComplete='bday'
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0]}
                    value={formData.dateofbirth}
                    onChange={(e) => handleChange('dateofbirth', e.target.value)}
                    required
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm md:text-base">Gender <span className='text-red-500'>*</span></Label>
              <Select 
                value={formData.gender}
                onValueChange={(value) => handleChange('gender', value)}
                required
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm md:text-base">State <span className='text-red-500'>*</span></Label>
                <Input 
                  id="state" 
                  placeholder="United States" 
                  autoComplete='address-level1'
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm md:text-base">City <span className='text-red-500'>*</span></Label>
                <Input 
                  id="city" 
                  placeholder="City" 
                  autoComplete='address-level2'
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm md:text-base">Country <span className='text-red-500'>*</span></Label>
                <Input 
                  id="country" 
                  placeholder="United States" 
                  autoComplete='country-name'
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-sm md:text-base">Pincode <span className='text-red-500'>*</span></Label>
                <Input 
                  id="pincode" 
                  placeholder="12345" 
                  autoComplete='postal-code'
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-sm md:text-base">Social Media</span>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <FacebookIcon className="h-5 w-5 text-blue-600" />
                  <Input 
                    id="facebook" 
                    placeholder="Facebook ID" 
                    autoComplete='url'
                    value={formData.facebook}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <InstagramIcon className="h-5 w-5 text-pink-600" />
                  <Input 
                    id="instagram" 
                    placeholder="Instagram ID" 
                    autoComplete='url'
                    value={formData.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <LinkedinIcon className="h-5 w-5 text-blue-700" />
                  <Input 
                    id="linkedin" 
                    placeholder="LinkedIn ID" 
                    autoComplete='url'
                    value={formData.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={(e)=>updateProfile(e)} className="w-full h-11 text-base mt-2">Save Changes</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </form>
  )
}