import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-1.5 text-white">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="text-xl font-bold text-white">
                                Career<span className="text-indigo-400">Matrimony</span>
                            </div>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                            The #1 platform for ambitious professionals to find their perfect life partner. Connect based on career, goals, and values.
                        </p>
                        <div className="flex space-x-4">
                            <SocialLink href="#" icon={Facebook} />
                            <SocialLink href="#" icon={Twitter} />
                            <SocialLink href="#" icon={Instagram} />
                            <SocialLink href="#" icon={Linkedin} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Explore</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/matches">Find Matches</FooterLink>
                            <FooterLink href="/stories">Success Stories</FooterLink>
                            <FooterLink href="/pricing">Membership Plans</FooterLink>
                            <FooterLink href="/about">About Us</FooterLink>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Legal</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                            <FooterLink href="/security">Trust & Safety</FooterLink>
                            <FooterLink href="/guidelines">Community Guidelines</FooterLink>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-3 text-indigo-500 shrink-0" />
                                <span className="text-sm text-slate-400">123 Innovation Park, Tech City,<br />Bangalore, KA 560001</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 mr-3 text-indigo-500 shrink-0" />
                                <span className="text-sm text-slate-400">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 mr-3 text-indigo-500 shrink-0" />
                                <span className="text-sm text-slate-400">help@careermatrimony.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 border-t border-slate-800 pt-8 text-center md:flex md:justify-between md:text-left">
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} Career Matrimony. All rights reserved.
                    </p>
                    <p className="text-sm text-slate-600 mt-2 md:mt-0">
                        Made with <span className="text-red-500">♥</span> for Professionals
                    </p>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon }: any) {
    return (
        <Link href={href} className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-all duration-300">
            <Icon className="h-5 w-5" />
        </Link>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                {children}
            </Link>
        </li>
    );
}
