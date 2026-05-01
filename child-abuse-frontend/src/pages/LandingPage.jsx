import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Phone, 
  Users, 
  MapPin, 
  Clock, 
  Award,
  ChevronRight,
  Globe,
  Heart,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Search
} from 'lucide-react';
import { Button, Card, CardBody } from '../components/ui';
import AnimatedCounter from '../components/AnimatedCounter';
import ImpactMap from '../components/ImpactMap';

export default function LandingPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = ['English', 'Hausa', 'Igbo', 'Yoruba'];

  return (
    <div className="page-container">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface-elevated shadow-lg backdrop-blur-md' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-container-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">ChildSafe NG</div>
                <div className="text-xs text-gray-600">Nigeria's Child Protection Command Center</div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-secondary-600 transition-colors">About</a>
              <a href="#impact" className="text-gray-700 hover:text-secondary-600 transition-colors">Impact</a>
              <a href="#resources" className="text-gray-700 hover:text-secondary-600 transition-colors">Resources</a>
              <a href="#contact" className="text-gray-700 hover:text-secondary-600 transition-colors">Contact</a>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-sm border border-border-light rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-secondary-500"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>

              {/* Action Buttons */}
              <Link to="/login">
                <Button variant="ghost" size="sm">Agency Login</Button>
              </Link>
              <Link to="/track">
                <Button variant="outline" size="sm">Track Case</Button>
              </Link>
              <Link to="/report">
                <Button variant="primary" size="sm" className="animate-pulse-slow">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Viewport Height */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-secondary-600 to-accent-700">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
        </div>
        
        {/* Floating Particles Animation */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-8">
            {/* Emergency Banner */}
            <div className="bg-critical/90 backdrop-blur-sm border border-critical/50 rounded-xl p-4 max-w-2xl mx-auto animate-slide-down">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="h-5 w-5" />
                <span className="font-semibold">
                  🚨 If a child is in immediate danger, call NAPTIP helpline: 0800-CALL-NAPTIP
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Protect Nigeria's Future.
                <br />
                <span className="text-primary-300">Report Child Abuse.</span>
                <br />
                Save a Life.
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                24/7 Secure Reporting. Real-time Case Tracking. Nationwide Response Coordination.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle className="h-4 w-4" />
                <span>Endorsed by Federal Ministry of Women Affairs</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="h-4 w-4" />
                <span>ISO 27001 Certified Security</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="h-4 w-4" />
                <span>100% Anonymous Reporting</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="h-4 w-4" />
                <span>Avg Response: &lt;4 hours</span>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/report">
                <Button variant="primary" size="xl" className="bg-critical hover:bg-red-600 text-white shadow-2xl transform hover:scale-105 transition-all duration-200">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  🚨 EMERGENCY REPORT
                </Button>
              </Link>
              <Link to="/report">
                <Button variant="secondary" size="xl" className="bg-white text-gray-900 hover:bg-gray-50 shadow-xl">
                  <Shield className="h-6 w-6 mr-3" />
                  Anonymous Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Counter Section */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Impact, Real Numbers</h2>
            <p className="text-xl text-gray-600">Together we're making a difference in children's lives</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <CardBody>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  <AnimatedCounter target={12847} suffix="+" />
                </div>
                <p className="text-gray-600 font-medium">Children Protected This Year</p>
              </CardBody>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <CardBody>
                <div className="text-4xl font-bold text-secondary-600 mb-2">
                  <AnimatedCounter target={3421} suffix="+" />
                </div>
                <p className="text-gray-600 font-medium">Active Cases Being Resolved</p>
              </CardBody>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <CardBody>
                <div className="text-4xl font-bold text-success mb-2">
                  <AnimatedCounter target={2156} suffix="+" />
                </div>
                <p className="text-gray-600 font-medium">Offenders Apprehended</p>
              </CardBody>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <CardBody>
                <div className="text-4xl font-bold text-accent-600 mb-2">
                  <AnimatedCounter target={487} suffix="+" />
                </div>
                <p className="text-gray-600 font-medium">Communities Reached</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Map Section */}
      <section id="impact" className="py-20 bg-surface-primary">
        <div className="max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">National Impact Map</h2>
            <p className="text-xl text-gray-600">Click on any state to see detailed statistics and response rates</p>
          </div>
          
          <div className="bg-surface-elevated rounded-2xl shadow-xl p-8">
            <ImpactMap />
          </div>
        </div>
      </section>

      {/* Success Stories Carousel */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real lives changed through your reports</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-success" />
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "Helped rescue 4 children from trafficking ring through anonymous reporting. The response was immediate and professional."
                </blockquote>
                <div className="text-sm text-gray-500">
                  <div className="font-semibold">Anonymous Reporter</div>
                  <div>Lagos State</div>
                </div>
                <div className="mt-4 pt-4 border-t border-border-light">
                  <div className="flex justify-between text-sm">
                    <span className="text-success">✓ Resolved</span>
                    <span>6-month follow-up: 95% recovery rate</span>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-secondary-600" />
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "The system helped identify a pattern of abuse in our community. Authorities intervened before more children were harmed."
                </blockquote>
                <div className="text-sm text-gray-500">
                  <div className="font-semibold">Community Leader</div>
                  <div>Rivers State</div>
                </div>
                <div className="mt-4 pt-4 border-t border-border-light">
                  <div className="flex justify-between text-sm">
                    <span className="text-success">✓ Prevention Success</span>
                    <span>12 children protected</span>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-primary-600" />
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "As a teacher, the mandatory reporting training and platform made it easy to report concerns safely and anonymously."
                </blockquote>
                <div className="text-sm text-gray-500">
                  <div className="font-semibold">Teacher</div>
                  <div>Abuja FCT</div>
                </div>
                <div className="mt-4 pt-4 border-t border-border-light">
                  <div className="flex justify-between text-sm">
                    <span className="text-success">✓ Ongoing Support</span>
                    <span>3 students receiving counseling</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface-primary">
        <div className="max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">4 simple steps to protect a child</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Report",
                description: "Click-to-call, SMS, WhatsApp, Web - All channels available 24/7",
                icon: <Phone className="h-8 w-8" />,
                color: "primary"
              },
              {
                step: 2,
                title: "Triage",
                description: "AI-powered risk assessment in 1-3 minutes",
                icon: <AlertTriangle className="h-8 w-8" />,
                color: "warning"
              },
              {
                step: 3,
                title: "Intervention",
                description: "Dispatch nearest Social Worker/Police to the location",
                icon: <MapPin className="h-8 w-8" />,
                color: "secondary"
              },
              {
                step: 4,
                title: "Resolution",
                description: "Track progress via unique code until case is resolved",
                icon: <CheckCircle className="h-8 w-8" />,
                color: "success"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardBody>
                    <div className={`w-16 h-16 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <div className={`text-${item.color}-600`}>{item.icon}</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">Step {item.step}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardBody>
                </Card>
                
                {/* Arrow Connector */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Hub */}
      <section id="resources" className="py-20 bg-surface-secondary">
        <div className="max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Resource Hub</h2>
            <p className="text-xl text-gray-600">Download guides and get help</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recognizing Signs of Abuse</h3>
                <p className="text-gray-600 mb-4">Comprehensive guide for identifying different types of child abuse</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">English</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Hausa</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Igbo</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Yoruba</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Download PDF
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardBody>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-secondary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Report Safely</h3>
                <p className="text-gray-600 mb-4">Video tutorials on secure reporting methods</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>5 videos</span>
                  <span>•</span>
                  <span>15 min total</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Watch Videos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardBody>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Child Rights Act 2003</h3>
                <p className="text-gray-600 mb-4">Legal guide to child protection laws in Nigeria</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>Legal document</span>
                  <span>•</span>
                  <span>24 pages</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Every report matters. Every child deserves protection. Take action now.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/report">
                <Button variant="primary" size="xl" className="bg-white text-gray-900 hover:bg-gray-50">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  Report Now
                </Button>
              </Link>
              <Link to="/track">
                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <Search className="h-6 w-6 mr-3" />
                  Track Case
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="text-lg font-bold">ChildSafe NG</div>
              </div>
              <p className="text-gray-400 text-sm">
                Nigeria's Child Protection Command Center - Securing the future of our children.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/report" className="hover:text-white transition-colors">Reporting Portal</Link></li>
                <li><Link to="/track" className="hover:text-white transition-colors">Track Case</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Agency Login</Link></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Policies</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#data" className="hover:text-white transition-colors">Data Retention</a></li>
                <li><a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Partners</h4>
              <div className="text-sm text-gray-400 space-y-1">
                <p>UNICEF Nigeria</p>
                <p>NAPTIP</p>
                <p>Ministry of Women Affairs</p>
                <p>Nigeria Police Force</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 ChildSafe NG. All rights reserved. | ISO 27001 Certified | NDPR Compliant</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
