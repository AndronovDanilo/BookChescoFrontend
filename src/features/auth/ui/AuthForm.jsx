import React from 'react';
import Input from '../../../shared/ui/Input/Input';
import Button from '../../../shared/ui/Button/Button';

function AuthForm({ isLogin, formData, handleChange, handleSubmit, isLoading }) {
    return (
        <form onSubmit={handleSubmit}>
            {isLogin ? (
                <>
                    <Input 
                        name="login" 
                        placeholder="Username or Email" 
                        type="text" 
                        value={formData.login} 
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <Input 
                        name="password" 
                        placeholder="Password" 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </>
            ) : (
                <>
                    <Input 
                        name="login" 
                        placeholder="Username" 
                        type="text" 
                        value={formData.login} 
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <Input 
                        name="email" 
                        placeholder="Email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <Input 
                        name="password" 
                        placeholder="Password" 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <Input 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        type="password" 
                        value={formData.confirmPassword} 
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </>
            )}
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Please wait..." : (isLogin ? "Log In" : "Sign Up")}
            </Button>
        </form>
    );
}

export default AuthForm;
