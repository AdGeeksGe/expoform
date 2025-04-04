import React, { useState } from 'react';
import { Mail, User, Phone } from 'lucide-react';

interface FormData {
  name: string;
  surname: string;
  tel: string;
  email: string;
  acceptTerms: boolean;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    tel: '',
    email: '',
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      console.log('Sending form data:', formData);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.details || data.error || 'რეგისტრაციისას მოხდა შეცდომა');
      }

      setMessage({ type: 'success', text: 'თქვენი წარმატებით დარეგისტრირდით!' });
      setFormData({
        name: '',
        surname: '',
        tel: '',
        email: '',
        acceptTerms: false,
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'რეგისტრაციისას მოხდა შეცდომა, გთხოვთ, სცადოთ კიდევ ერთხელ.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8">
        {/* <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">შეავსე ფორმა</h1> */}
        
        {message && (
          <div className={`mb-4 p-4 rounded ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              {/* <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /> */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="სახელი"
                required
                className="w-full pl-4 pr-4 py-2 border border-gray-300 focus:ring focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              {/* <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /> */}
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder="გვარი"
                required
                className="w-full pl-4 pr-4 py-2 border border-gray-300 focus:ring focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              {/* <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /> */}
              <input
                type="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder="ტელეფონის ნომერი"
                required
                className="w-full pl-4 pr-4 py-2 border border-gray-300 focus:ring focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              {/* <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /> */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ელ-ფოსტა"
                required
                className="w-full pl-4 pr-4 py-2 border border-gray-300 focus:ring focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
              className="mt-1 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <label className="ml-2 block text-sm text-gray-700">
              ვეთანხმები წესებს და პირობებს
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'გთხოვთ მოიცადოთ...' : 'რეგისტრაცია'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;