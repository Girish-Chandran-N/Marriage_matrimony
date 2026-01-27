import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Shield, Heart, Briefcase, ArrowRight, Star, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-slate-50"></div>
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob opacity-70"></div>
          <div className="absolute top-40 -left-20 w-[600px] h-[600px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000 opacity-70"></div>
          <div className="absolute -bottom-40 right-40 w-[600px] h-[600px] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000 opacity-70"></div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* Content Container - Centered */}
        <div className="relative z-10 max-w-5xl px-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm text-sm font-semibold text-slate-600 mb-4 hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            India's #1 Career-Focused Matrimony
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight text-slate-900 drop-shadow-sm">
            Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">Equal</span>.
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Where ambitious professionals find love. Connect with someone who understands your drive, your goals, and your heart.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">
            <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg px-10 py-8 h-auto rounded-full font-bold shadow-2xl transition-all hover:scale-105 border border-white/20">
              <Link href="/register">Start Your Journey <ArrowRight className="ml-2 h-6 w-6" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 py-8 h-auto rounded-full border-2 border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-purple-200 hover:text-purple-600 transition-all font-bold">
              <Link href="/matches">Explore Matches</Link>
            </Button>
          </div>
        </div>

        {/* Floating UI Elements Decor - MOVED OUTSIDE CONTENT CONTAINER */}
        {/* Left Card */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 xl:left-8 hidden 2xl:block animate-bounce duration-[3000ms] z-20 pointer-events-none">
          <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-pink-200/50 border-2 border-pink-100 rotate-[-8deg] hover:rotate-0 transition-transform duration-300 w-64">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl">👩‍💻</div>
              <div className="flex -ml-4 w-10 h-10 rounded-full bg-blue-100 items-center justify-center text-xl border-2 border-white">👨‍⚕️</div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Perfect Match!</h3>
                <p className="text-[10px] text-slate-500">Software Eng. & Doctor</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full w-full"></div>
            </div>
            <p className="text-right text-[9px] font-bold text-pink-600 mt-1">100% Compatible</p>
          </div>
        </div>

        {/* Right Card */}
        <div className="absolute top-1/2 -translate-y-1/2 right-4 xl:right-8 hidden 2xl:block animate-bounce duration-[4000ms] z-20 pointer-events-none">
          <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-blue-200/50 border-2 border-blue-100 rotate-[8deg] hover:rotate-0 transition-transform duration-300 w-64">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl animate-pulse">
                💍
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">She said Yes!</h3>
                <p className="text-[10px] text-slate-500">Just happened</p>
              </div>
            </div>
            <div className="flex gap-1 mt-2 justify-center">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </div>

      </section>

      {/* Trust Stats Bar */}
      <section className="bg-white border-y border-slate-100 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Profiles", value: "10k+", icon: Users, color: "text-blue-600" },
            { label: "Success Stories", value: "500+", icon: Heart, color: "text-pink-600" },
            { label: "Verified Careers", value: "100%", icon: Shield, color: "text-green-600" },
            { label: "Cities Covered", value: "50+", icon: Sparkles, color: "text-purple-600" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center group cursor-default">
              <div className={`mb-3 p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50/50 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Why professionals choose us.</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We go beyond basic details. Our platform is designed for professionals who value transparency, ambition, and authentic connections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "100% Verified Profiles",
                desc: "Every profile is manually verified. We strictly check career credentials to ensure you meet real professionals.",
                icon: Shield,
                color: "blue",
                delay: "0"
              },
              {
                title: "Career Compatibility",
                desc: "Our algorithm matches you not just on personal preferences, but on professional goals, industry, and lifestyle.",
                icon: Briefcase,
                color: "purple",
                delay: "200"
              },
              {
                title: "Privacy First",
                desc: "Control who sees your photos and contact details. Your privacy is our top priority, always.",
                icon: Heart,
                color: "pink",
                delay: "400"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-${feature.color}-50`}>
                  <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-3xl opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-bold tracking-wider uppercase text-sm mb-2 block">Real Results</span>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Love Stories</h2>
            <p className="text-slate-600">Real couples who found love on Career Matrimony</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                names: "Rahul & Priya",
                jobs: "Software Engineers, Bangalore",
                quote: "We both work in IT and understand the busy schedules. Finding someone who 'gets it' was impossible until I joined here.",
                image: "/assets/success_story_couple_1_1769432525072.png"
              },
              {
                names: "Arjun & Sneha",
                jobs: "Doctor & Architect, Mumbai",
                quote: "I was looking for someone ambitious yet family-oriented. The detailed career profiles helped me find my perfect match.",
                image: "/assets/success_story_couple_2_1769432540813.png"
              }
            ].map((story, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 items-center bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-purple-100 transition-colors">
                <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={story.image}
                    alt="Success Story"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div>
                  <div className="flex text-yellow-400 mb-3 gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-slate-700 italic mb-4 text-lg leading-relaxed">"{story.quote}"</p>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{story.names}</p>
                    <p className="text-sm text-slate-500 font-medium">{story.jobs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 space-y-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Ready to find your partner?</h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">Join thousands of professionals who have found their soulmate, their best friend, and their equal here.</p>
          <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg px-10 py-8 h-auto rounded-full font-bold shadow-2xl transition-all hover:scale-105 border border-white/20">
            <Link href="/register">Get Started For Free <ArrowRight className="ml-2 h-6 w-6" /></Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
