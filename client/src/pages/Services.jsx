import React from 'react';
import Card from '../components/ui/Card';
import { Truck, Box, Car, Home, Anchor, Container } from 'lucide-react';

const Services = () => {
    const services = [
        {
            id: 'ftl',
            title: 'Full Truckload (FTL)',
            desc: 'Dedicated trucks for large shipments. Ideal for bulk goods requiring the entire vehicle capacity. Fastest transit times with no stops.',
            icon: <Truck size={40} />
        },
        {
            id: 'ltl',
            title: 'Part Load (LTL)',
            desc: 'Cost-effective solution for smaller shipments. Pay only for the space you use. Your cargo shares space with other shipments.',
            icon: <Box size={40} />
        },
        {
            id: 'car-moving',
            title: 'Car Moving Services',
            desc: 'Safe and secure vehicle transportation. Door-to-door delivery using specialized car carriers for zero-damage transport.',
            icon: <Car size={40} />
        },
        {
            id: 'packers',
            title: 'Packers & Movers',
            desc: 'Professional house and office shifting services. Includes expert packing, loading, transportation, and unloading.',
            icon: <Home size={40} />
        },
        {
            id: 'towing',
            title: 'Car Towing Services',
            desc: '24/7 emergency towing and recovery services. Fast response times for breakdowns or accidents across major highways.',
            icon: <Anchor size={40} />
        },
        {
            id: 'container',
            title: 'Container Transport',
            desc: 'Specialized 20ft and 40ft container haulage. Perfect for import/export cargo moving between ports and dry ports.',
            icon: <Container size={40} />
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <span className="text-gold font-bold uppercase tracking-wider text-sm">Our Expertise</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2 mb-6">World-Class Logistics Services</h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        GoldTrack.pk offers a comprehensive suite of logistics solutions tailored to meet the dynamic needs of businesses in Pakistan.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <Card className="h-full p-8 hover:shadow-2xl transition-all duration-300 border-gold/20 hover:border-gold hover:-translate-y-2 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 group-hover:bg-gold/20 z-0"></div>

                                <div className="relative z-10">
                                    <div className="mb-6 text-gold group-hover:scale-110 transition-transform origin-left">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-gold transition-colors">{service.title}</h3>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        {service.desc}
                                    </p>
                                    <button className="text-gold font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Book This Service <span className="text-xl">&rarr;</span>
                                    </button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
