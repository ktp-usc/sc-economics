// "use client";
//
// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { Lock, CheckCircle2 } from "lucide-react";
//
// export default function ConfirmResetPasswordPage() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [isSuccess, setIsSuccess] = useState(false);
//     const [token, setToken] = useState<string | null>(null);
//     const [email, setEmail] = useState<string | null>(null);
//
//     useEffect(() => {
//         const tokenParam = searchParams.get("token");
//         const emailParam = searchParams.get("email");
//         setToken(tokenParam);
//         setEmail(emailParam);
//
//         if (!tokenParam || !emailParam) {
//             toast.error("Invalid reset link");
//             router.push("/reset-password");
//         }
//     }, [searchParams, router]);
//
//     const handleReset = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         if (password !== confirmPassword) {
//             toast.error("Passwords do not match");
//             return;
//         }
//
//         if (password.length < 6) {
//             toast.error("Password must be at least 6 characters");
//             return;
//         }
//
//         if (!token || !email) {
//             toast.error("Invalid reset link");
//             return;
//         }
//
//         setIsLoading(true);
//
//         try {
//             const response = await fetch("/api/reset-password/confirm", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ token, email, newPassword: password }),
//             });
//
//             const data = await response.json();
//
//             if (response.ok) {
//                 toast.success("Password reset successfully!");
//                 setIsSuccess(true);
//                 setTimeout(() => {
//                     router.push("/login");
//                 }, 2000);
//             } else {
//                 toast.error(data.error || "Failed to reset password");
//             }
//         } catch (error) {
//             toast.error("An error occurred. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     if (isSuccess) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-background p-4">
//                 <Card className="w-full max-w-md">
//                     <CardHeader className="space-y-1 text-center">
//                         <div className="flex justify-center mb-4">
//                             <CheckCircle2 className="h-16 w-16 text-green-500" />
//                         </div>
//                         <CardTitle className="text-2xl font-bold">
//                             Password Reset Successful!
//                         </CardTitle>
//                         <CardDescription>
//                             Your password has been reset. Redirecting to login...
//                         </CardDescription>
//                     </CardHeader>
//                 </Card>
//             </div>
//         );
//     }
//
//     if (!token || !email) {
//         return null;
//     }
//
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-background p-4">
//             <Card className="w-full max-w-md">
//                 <CardHeader className="space-y-1">
//                     <CardTitle className="text-2xl font-bold text-center">
//                         Set New Password
//                     </CardTitle>
//                     <CardDescription className="text-center">
//                         Enter your new password for {email}
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleReset} className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="password">New Password</Label>
//                             <div className="relative">
//                                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                                 <Input
//                                     id="password"
//                                     type="password"
//                                     placeholder="Enter new password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className="pl-10"
//                                     required
//                                     disabled={isLoading}
//                                     minLength={6}
//                                 />
//                             </div>
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="confirmPassword">Confirm Password</Label>
//                             <div className="relative">
//                                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                                 <Input
//                                     id="confirmPassword"
//                                     type="password"
//                                     placeholder="Confirm new password"
//                                     value={confirmPassword}
//                                     onChange={(e) => setConfirmPassword(e.target.value)}
//                                     className="pl-10"
//                                     required
//                                     disabled={isLoading}
//                                     minLength={6}
//                                 />
//                             </div>
//                         </div>
//                         <Button
//                             type="submit"
//                             className="w-full"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? "Resetting..." : "Reset Password"}
//                         </Button>
//                         <div className="text-center">
//                             <Link
//                                 href="/login"
//                                 className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
//                             >
//                                 Back to Login
//                             </Link>
//                         </div>
//                     </form>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }