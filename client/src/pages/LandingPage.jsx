import React, { useEffect, useState } from 'react';
import { Shield, Lock, Key, ChevronRight, Database, Globe, CheckCircle, Fingerprint, Mail, Phone, MapPin, Send, Download } from 'lucide-react';

const LandingPage = () => {
  const GlassCard = ({ children, className = '' }) => (
    <div className={`backdrop-blur-lg bg-white/10 rounded-2xl p-6 shadow-xl border border-white/20 ${className}`}>
      {children}
    </div>
  );

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed
    const checkInstallation = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
      }
    };

    // Check initial installation status
    checkInstallation();

    // Listen for installation changes
    const handleInstallChange = (e) => {
      if (e.matches) {
        setIsInstalled(true);
      }
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(handleInstallChange);

    // Capture install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('PWA installed successfully');
    });

    // Cleanup
    return () => {
      mediaQuery.removeListener(handleInstallChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setIsInstalled(true);
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert('The app is not ready to install yet. Please try again later or use your browser\'s "Add to Home Screen" option.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-green-900 min-h-screen relative">
      {/* Enhanced Hero Section */}
      <section className="min-h-screen px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto pt-20">
          {/* Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-8 z-10">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-lg bg-white/10 border border-white/20">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-white/90 text-sm">Trusted by 1M+ users worldwide</span>
              </div>

              <h1 className="text-6xl font-bold text-white leading-tight">
                Password Security
                <span className="block text-emerald-400">Simplified.</span>
              </h1>

              <p className="text-xl text-white/80 leading-relaxed">
                One secure vault for all your passwords. Military-grade encryption meets intuitive design.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-semibold transition-all flex items-center justify-center space-x-2">
                  <span>Start Now </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 backdrop-blur-lg bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all flex items-center justify-center space-x-2">
                  <span>Watch Demo</span>
                  <Shield className="w-5 h-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { value: '256-bit', label: 'Encryption' },
                  { value: '99.9%', label: 'Uptime' },
                  { value: '24/7', label: 'Support' }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Interactive Display */}
            <div className="lg:col-span-6 z-10">
              <GlassCard className="p-8 transform lg:translate-y-12">
                <div className="space-y-6">
                  {/* Password Manager Interface Mock */}
                  <div className="bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Lock className="w-8 h-8 text-emerald-400" />
                        <span className="text-white font-semibold">Password Vault</span>
                      </div>
                      <Fingerprint className="w-8 h-8 text-emerald-400" />
                    </div>

                    {/* Password Items */}
                    {[1, 2, 3].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="text-white">••••••••••••</div>
                        </div>
                        <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative min-h-screen px-4 py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-green-500/15 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-white leading-tight">
            Powerful Features <span className="text-emerald-400">for Modern Security</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Discover the tools that make your digital life secure and effortless.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Key className="w-12 h-12 text-emerald-400" />,
              title: "Password Generator",
              description: "Create strong, unique passwords instantly with our advanced generator.",
            },
            {
              icon: <Globe className="w-12 h-12 text-emerald-400" />,
              title: "Cross-Platform Sync",
              description: "Seamlessly access your vault from any device, anywhere.",
            },
            {
              icon: <Database className="w-12 h-12 text-emerald-400" />,
              title: "Secure Storage",
              description: "Bank-level encryption keeps your data safe and private.",
            },
          ].map((feature, idx) => (
            <GlassCard
              key={idx}
              className="group space-y-6 p-8 bg-gradient-to-br from-white/10 to-emerald-500/5 hover:from-white/20 hover:to-emerald-500/15 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Icon with subtle animation */}
              <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              {/* Title */}
              <h3 className="text-2xl font-semibold text-white text-center group-hover:text-emerald-400 transition-colors duration-300">
                {feature.title}
              </h3>
              {/* Description */}
              <p className="text-white/80 text-center text-base leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>

      {/* Security Section */}
    <section className="relative min-h-screen px-6 py-24 bg-gradient-to-r from-emerald-900 to-green-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 right-20 w-96 h-96 bg-green-500/15 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <GlassCard className="p-8 md:p-12 space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Lock className="w-12 h-12 text-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-5xl font-extrabold text-white leading-tight">
              Enterprise-Grade <span className="text-emerald-400">Security</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Your data deserves the highest level of protection. We’ve got you covered with cutting-edge security features.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "256-bit AES Encryption",
                description: "Industry-standard encryption ensures your passwords are unreadable to anyone but you.",
              },
              {
                title: "Zero-Knowledge Architecture",
                description: "We never see your data—only you have access to your vault.",
              },
              {
                title: "Two-Factor Authentication",
                description: "Add an extra layer of security with 2FA for peace of mind.",
              },
              {
                title: "Regular Security Audits",
                description: "Independent experts continuously verify our security standards.",
              },
              {
                title: "Biometric Authentication",
                description: "Unlock your vault securely with fingerprint or face recognition.",
              },
              {
                title: "Automatic Backup",
                description: "Your data is safely backed up without any effort on your part.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group flex items-start space-x-4 bg-white/5 p-6 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:-translate-y-1"
              >
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>          
        </GlassCard>
      </div>
    </section>


      {/* Pricing Section */}
      <section id='pricing' className="min-h-screen px-4 py-20">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-white text-center">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Free",
                price: "$0",
                features: ["Basic password storage", "Password generator", "Secure notes"]
              },
              {
                title: "Premium",
                price: "$4.99",
                features: ["Everything in Free", "Cross-platform sync", "Secure sharing"]
              },
              {
                title: "Business",
                price: "$8.99",
                features: ["Everything in Premium", "Admin console", "User management"]
              }
            ].map((plan, idx) => (
              <GlassCard key={idx} className="space-y-6">
                <h3 className="text-2xl font-bold text-white">{plan.title}</h3>
                <div className="text-3xl font-bold text-emerald-400">{plan.price}<span className="text-lg text-white/60">/month</span></div>
                <ul className="space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center space-x-2 text-white">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-semibold transition-all">
                  Get Started
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-us" className="min-h-screen px-6 py-24 bg-gradient-to-r from-emerald-900 to-green-900">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8 md:p-12 space-y-10">
            {/* Heading */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-extrabold text-white">Get in Touch</h2>
              <p className="text-lg text-gray-300">We'd love to hear from you</p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Email Us", icon: <Mail className="w-6 h-6 text-emerald-400" />, content: "support@yourapp.com" },
                { title: "Call Us", icon: <Phone className="w-6 h-6 text-emerald-400" />, content: "+1 234 567 890" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 bg-white/5 p-4 rounded-lg transition-transform transform hover:scale-105">
                  {item.icon}
                  <div className="text-white">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-gray-300">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-white text-center mb-6">Send a Message</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <input type="email" placeholder="Your Email" className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <textarea placeholder="Your Message" rows="4" className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"></textarea>
                <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all">
                  <Send className="w-5 h-5" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Install App Button (PWA Prompt) */}
      {!isInstalled && deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-6 right-6 p-4 backdrop-blur-lg bg-emerald-500/90 hover:bg-emerald-600 rounded-full shadow-lg text-white flex items-center space-x-2 animate-pulse transition-all z-50"
          title="Install Password Manager"
        >
          <Download className="w-6 h-6" />
          <span className="text-sm font-semibold">Install App</span>
        </button>
      )}
    </div>
  );
};

export default LandingPage;