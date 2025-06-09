import React from 'react';
import { Film, Tv, Users, Clock, Download, Globe, Award, Zap } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Film,
      number: '45K+',
      label: 'Movies',
      color: 'text-blue-400'
    },
    {
      icon: Tv,
      number: '28K+',
      label: 'TV Shows',
      color: 'text-purple-400'
    },
    {
      icon: Users,
      number: '12M+',
      label: 'Active Users',
      color: 'text-green-400'
    },
    {
      icon: Clock,
      number: '24/7',
      label: 'Streaming',
      color: 'text-yellow-400'
    },
    {
      icon: Download,
      number: '500M+',
      label: 'Downloads',
      color: 'text-pink-400'
    },
    {
      icon: Globe,
      number: '190+',
      label: 'Countries',
      color: 'text-cyan-400'
    },
    {
      icon: Award,
      number: '15K+',
      label: 'Award Winners',
      color: 'text-orange-400'
    },
    {
      icon: Zap,
      number: '4K',
      label: 'Ultra HD',
      color: 'text-red-400'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose LandeMon?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join millions of users worldwide and experience the ultimate streaming platform
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <div className="mb-4 p-3 rounded-full bg-gray-700/50 group-hover:bg-gray-600/50 transition-colors duration-300">
                      <IconComponent className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{stat.number}</h3>
                    <p className="text-gray-300 font-medium">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;