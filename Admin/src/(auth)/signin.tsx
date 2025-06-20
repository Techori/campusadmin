import { useState } from 'react';
     import { useNavigate } from 'react-router-dom';
     import { User, AlertCircle } from 'lucide-react';
     import { Button } from '@/components/ui/button';
     import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

     const SignIn = () => {
       const navigate = useNavigate();
       const [formData, setFormData] = useState({ email: '', password: '' });
       const [error, setError] = useState<string | null>(null);
       const [isSubmitting, setIsSubmitting] = useState(false);

       const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const { name, value } = e.target;
         setFormData(prev => ({ ...prev, [name]: value }));
         if (error) setError(null);
       };

       const validateForm = () => {
         if (!formData.email || !formData.password) {
           setError('Please enter both email and password');
           return false;
         }
         if (!/\S+@\S+\.\S+/.test(formData.email)) {
           setError('Please enter a valid email address');
           return false;
         }
         return true;
       };

       const handleSubmit = async (e: React.FormEvent) => {
         e.preventDefault();
         if (!validateForm()) return;

         setIsSubmitting(true);
         try {
           const response = await signIn(formData.email, formData.password);
           if (response.success) {
             localStorage.setItem('token', response.token);
             navigate('/admin_dashboard');
           } else {
             setError(response.message);
           }
         } catch (err) {
           setError('An unexpected error occurred');
         } finally {
           setIsSubmitting(false);
         }
       };

       const signIn = async (email: string, password: string) => {
         const response = await fetch(`${apiUrl}/api/login`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email, password })
         });
         return await response.json();
       };

       return (
         <div style={{
           minHeight: '100vh',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           background: '#F3F4F6',
           padding: '2rem'
         }}>
           <div style={{
             background: 'white',
             borderRadius: '1.5rem',
             padding: '3rem',
             width: '100%',
             maxWidth: '600px',
             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
           }}>
             <div style={{
               textAlign: 'center',
               marginBottom: '3rem'
             }}>
               <div style={{
                 color: '#8B5CF6',
                 fontSize: '4rem',
                 marginBottom: '1.5rem',
                 display: 'flex',
                 justifyContent: 'center'
               }}>
                 <User />
               </div>
               <h1 style={{
                 fontSize: '2rem',
                 fontWeight: 'bold',
                 color: '#1F2937',
                 marginBottom: '1rem'
               }}>
                 Sign In
               </h1>
               <p style={{
                 color: '#6B7280',
                 fontSize: '1.1rem'
               }}>
                 Access your dashboard
               </p>
             </div>
             {error && (
               <Alert variant="destructive" style={{ marginBottom: '1.5rem' }}>
                 <AlertCircle style={{ height: '1rem', width: '1rem' }} />
                 <AlertTitle>Error</AlertTitle>
                 <AlertDescription>{error}</AlertDescription>
               </Alert>
             )}
             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ position: 'relative' }}>
                 <input
                   type="email"
                   name="email"
                   value={formData.email}
                   onChange={handleInputChange}
                   style={{
                     width: '100%',
                     padding: '0.75rem 1rem',
                     border: '1px solid #D1D5DB',
                     borderRadius: '0.5rem',
                     fontSize: '1rem',
                     outline: 'none',
                     transition: 'border-color 0.2s',
                     background: '#F9FAFB'
                   }}
                   placeholder="Email"
                   required
                 />
               </div>
               <div style={{ position: 'relative' }}>
                 <input
                   type="password"
                   name="password"
                   value={formData.password}
                   onChange={handleInputChange}
                   style={{
                     width: '100%',
                     padding: '0.75rem 1rem',
                     border: '1px solid #D1D5DB',
                     borderRadius: '0.5rem',
                     fontSize: '1rem',
                     outline: 'none',
                     transition: 'border-color 0.2s',
                     background: '#F9FAFB'
                   }}
                   placeholder="Password"
                   required
                 />
               </div>
               <Button
                 type="submit"
                 disabled={isSubmitting}
                 style={{
                   width: '100%',
                   padding: '0.75rem',
                   background: isSubmitting ? '#6B7280' : '#8B5CF6',
                   color: 'white',
                   borderRadius: '0.5rem',
                   fontSize: '1rem',
                   fontWeight: '600',
                   cursor: isSubmitting ? 'not-allowed' : 'pointer',
                   transition: 'background-color 0.2s'
                 }}
               >
                 {isSubmitting ? 'Signing in...' : 'Sign In'}
               </Button>
             </form>
           </div>
         </div>
       );
     };

     export default SignIn;