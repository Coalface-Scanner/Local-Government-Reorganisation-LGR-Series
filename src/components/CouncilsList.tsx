import { MapPin } from 'lucide-react';

interface Region {
  name: string;
  councils: string[];
  color: string;
}

const regions: Region[] = [
  {
    name: 'South East',
    councils: ['Berkshire', 'East and West Sussex', 'Hampshire', 'Kent', 'Oxfordshire', 'Surrey'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'East',
    councils: ['Cambridgeshire & Peterborough', 'Essex', 'Hertfordshire', 'Norfolk', 'Suffolk'],
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'North West',
    councils: ['Lancashire'],
    color: 'from-teal-500 to-teal-600'
  },
  {
    name: 'South West',
    councils: ['Devon', 'Gloucestershire'],
    color: 'from-orange-500 to-orange-600'
  },
  {
    name: 'East Midlands',
    councils: ['Derbyshire', 'Leicestershire', 'Lincolnshire', 'Nottinghamshire'],
    color: 'from-red-500 to-red-600'
  },
  {
    name: 'West Midlands',
    councils: ['Staffordshire & Stoke', 'Warwickshire', 'Worcestershire'],
    color: 'from-amber-500 to-amber-600'
  }
];

export default function CouncilsList() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
      <div className="mb-8">
        <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-sm font-semibold text-slate-700 mb-4">
          Scope of Reorganisation
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Which councils are involved?
        </h2>
        <p className="text-slate-600 mb-4">
          The current reorganisation proposals affect councils across England, encompassing multiple regions and governance structures.
        </p>
        <div className="flex items-center gap-6 text-sm text-slate-700 bg-slate-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-slate-900">21</span>
            <span>County councils</span>
          </div>
          <div className="w-px h-6 bg-slate-300"></div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-slate-900">164</span>
            <span>District councils</span>
          </div>
          <div className="w-px h-6 bg-slate-300"></div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-slate-900">25</span>
            <span>Small unitaries</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {regions.map((region) => (
          <div
            key={region.name}
            className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${region.color} rounded-lg flex items-center justify-center`}>
                <MapPin className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{region.name}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {region.councils.map((council) => (
                <span
                  key={council}
                  className="inline-block px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  {council}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
