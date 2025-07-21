import React from 'react';
import { useCRM } from '../../context/CRMContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Users, Building2, Briefcase, Activity, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useCRM();

  const totalDeals = state.deals.length;
  const totalValue = state.deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealValue = totalDeals > 0 ? Math.round(totalValue / totalDeals) : 0;
  const winRate = state.deals.filter(deal => deal.stage === 'closed_won').length / totalDeals * 100;

  const stats = [
    {
      name: 'Total Contacts',
      value: state.contacts.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Companies',
      value: state.companies.filter(c => c.relationshipStatus === 'active').length,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Open Deals',
      value: state.deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length,
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'This Month Activities',
      value: state.activities.filter(a => {
        const activityDate = new Date(a.date);
        const currentMonth = new Date().getMonth();
        return activityDate.getMonth() === currentMonth;
      }).length,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentDeals = state.deals
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'closed_won':
        return 'success';
      case 'closed_lost':
        return 'danger';
      case 'negotiation':
        return 'warning';
      case 'proposal':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">{stat.name}</div>
            </Card>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <DollarSign size={32} className="text-green-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Deal Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${avgDealValue.toLocaleString()}
              </p>
            </div>
            <TrendingUp size={32} className="text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(winRate)}%
              </p>
            </div>
            <TrendingUp size={32} className="text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Recent Deals */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Deals</h2>
          <p className="text-sm text-gray-500">Latest opportunities in your pipeline</p>
        </div>
        
        <div className="space-y-3">
          {recentDeals.map((deal) => {
            const company = state.companies.find(c => c.id === deal.companyId);
            const contact = state.contacts.find(c => c.id === deal.contactId);
            
            return (
              <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">{deal.name}</h3>
                    <Badge variant={getStageColor(deal.stage)}>
                      {deal.stage.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {company?.name} • {contact?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${deal.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {deal.probability}% probability
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;