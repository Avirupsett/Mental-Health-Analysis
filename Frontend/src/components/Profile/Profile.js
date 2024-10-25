import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Profile = () => {
  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-purple-100 to-blue-100 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
              <p className="text-purple-100">Manage your personal information</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Name" id="name" placeholder="John Doe" icon="👤" />
              <ProfileField label="Email" id="email" type="email" placeholder="john@example.com" icon="📧" />
              <ProfileField label="Date of Birth" id="dob" type="date" icon="🎂" />
              <ProfileField label="Address" id="address" placeholder="123 Main St" icon="🏠" />
              <ProfileField label="Pincode" id="pincode" placeholder="12345" icon="📍" />
              <ProfileField label="Country" id="country" placeholder="United States" icon="🌎" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Social Media</h3>
              <div className="flex space-x-4">
                <SocialButton icon={<FaFacebook />} label="Facebook" />
                <SocialButton icon={<FaLinkedin />} label="LinkedIn" />
                <SocialButton icon={<FaInstagram />} label="Instagram" />
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileField = ({ label, id, type = "text", placeholder, icon }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center">
      <span className="mr-2">{icon}</span>
      {label}
    </Label>
    <Input id={id} type={type} placeholder={placeholder} className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50" />
  </div>
);

const SocialButton = ({ icon, label }) => (
  <Button variant="outline" className="flex items-center space-x-2 hover:bg-gray-100">
    {icon}
    <span>{label}</span>
  </Button>
);

export default Profile;

