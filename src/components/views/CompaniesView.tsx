import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Company } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Plus, Edit, Trash2, Building, MapPin, DollarSign, Users, Calendar, TrendingUp, Zap, Wind, Fuel, Battery, Grid, Lightbulb, Factory, HardHat, Briefcase, Building2 } from 'lucide-react';

const CompaniesView: React.FC = () => {
  const { state, dispatch } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'utility' as const,
    industrySegment: 'solar' as const,
    city: '',
    state: '',
    country: 'USA',
    territory: '',
    size: 'medium' as const,
    revenue: '',
    relationshipStatus: 'prospect' as const
  });

  const filteredCompanies = state.companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || company.type === selectedType;
    const matchesSegment = selectedSegment === 'all' || company.industrySegment === selectedSegment;
    const matchesStatus = selectedStatus === 'all' || company.relationshipStatus === selectedStatus;
    return matchesSearch && matchesType && matchesSegment && matchesStatus;
  });

  const sortedCompanies = filteredCompanies.sort((a, b) => 
    (b.revenue || 0) - (a.revenue || 0)
  );

  const handleAddCompany = () => {
    if (!formData.name || !formData.city || !formData.state) return;

    const newCompany: Company = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      industrySegment: formData.industrySegment,
      location: {
        city: formData.city,
        state: formData.state,
        country: formData.country
      },
      territory: formData.territory,
      size: formData.size,
      revenue: formData.revenue ? parseInt(formData.revenue) : undefined,
      relationshipStatus: formData.relationshipStatus,
      createdDate: new Date(),
      lastContactDate: new Date()
    };

    dispatch({ type: 'ADD_COMPANY', payload: newCompany });
    resetForm();
  };

  const handleEditCompany = () => {
    if (!editingCompany || !formData.name || !formData.city || !formData.state) return;

    const updatedCompany: Company = {
      ...editingCompany,
      name: formData.name,
      type: formData.type,
      industrySegment: formData.industrySegment,
      location: {
        city: formData.city,
        state: formData.state,
        country: formData.country
      },
      territory: formData.territory,
      size: formData.size,
      revenue: formData.revenue ? parseInt(formData.revenue) : undefined,
      relationshipStatus: formData.relationshipStatus
    };

    dispatch({ type: 'UPDATE_COMPANY', payload: updatedCompany });
    resetForm();
  };

  const handleDeleteCompany = (companyId: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      dispatch({ type: 'DELETE_COMPANY', payload: companyId });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'utility',
      industrySegment: 'solar',
      city: '',
      state: '',
      country: 'USA',
      territory: '',
      size: 'medium',
      revenue: '',
      relationshipStatus: 'prospect'
    });
    setShowAddForm(false);
    setEditingCompany(null);
  };

  const startEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      type: company.type,
      industrySegment: company.industrySegment,
      city: company.location.city,
      state: company.location.state,
      country: company.location.country,
      territory: company.territory,
      size: company.size,
      revenue: company.revenue?.toString() || '',
      relationshipStatus: company.relationshipStatus
    });
    setShowAddForm(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'utility': return Zap;
      case 'developer': return Building2;
      case 'epc': return HardHat;
      case 'manufacturer': return Factory;
      case 'consultant': return Briefcase;
      case 'government': return Building;
      default: return Building;
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'solar': return Zap;
      case 'wind': return Wind;
      case 'oil_gas': return Fuel;
      case 'storage': return Battery;
      case 'grid': return Grid;
      case 'efficiency': return Lightbulb;
      default: return Zap;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'utility': return 'info';
      case 'developer': return 'success';
      case 'epc': return 'warning';
      case 'manufacturer': return 'default';
      case 'consultant': return 'info';
      case 'government': return 'danger';
      default: return 'default';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'solar': return 'warning';
      case 'wind': return 'info';
      case 'oil_gas': return 'default';
      case 'storage': return 'success';
      case 'grid': return 'danger';
      case 'efficiency': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'prospect': return 'info';
      case 'inactive': return 'warning';
      case 'competitor': return 'danger';
      default: return 'default';
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'enterprise': return 'success';
      case 'large': return 'info';
      case 'medium': return 'warning';
      case 'small': return 'default';
      default: return 'default';
    }
  };

  // Calculate stats
  const totalRevenue = filteredCompanies.reduce((sum, company) => sum + (company.revenue || 0), 0);
  const activeCompanies = filteredCompanies.filter(c => c.relationshipStatus === 'active');
  const avgRevenue = filteredCompanies.length > 0 ? totalRevenue / filteredCompanies.length : 0;

  // Get company contacts and deals
  const getCompanyContacts = (companyId: string) => {
    return state.contacts.filter(contact => contact.companyId === companyId);
  };

  const getCompanyDeals = (companyId: string) => {
    return state.deals.filter(deal => deal.companyId === companyId);
  };

  const getCompanyTotalDealValue = (companyId: string) => {
    return getCompanyDeals(companyId).reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <div className="space-y-8">
      {/* Company Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gradient">
                {filteredCompanies.length}
              </p>
            </div>
            <Building size={32} className="text-blue-500" />
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Partners</p>
              <p className="text-2xl font-bold text-gradient">
                {activeCompanies.length}
              </p>
            </div>
            <TrendingUp size={32} className="text-green-500" />
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gradient">
                ${(totalRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign size={32} className="text-purple-500" />
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Revenue</p>
              <p className="text-2xl font-bold text-gradient">
                ${(avgRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <TrendingUp size={32} className="text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Add Button */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="utility">Utility</option>
            <option value="developer">Developer</option>
            <option value="epc">EPC</option>
            <option value="manufacturer">Manufacturer</option>
            <option value="consultant">Consultant</option>
            <option value="government">Government</option>
          </Select>
          <Select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
          >
            <option value="all">All Segments</option>
            <option value="solar">Solar</option>
            <option value="wind">Wind</option>
            <option value="oil_gas">Oil & Gas</option>
            <option value="storage">Storage</option>
            <option value="grid">Grid</option>
            <option value="efficiency">Efficiency</option>
          </Select>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="prospect">Prospect</option>
            <option value="inactive">Inactive</option>
            <option value="competitor">Competitor</option>
          </Select>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Company</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gradient">
              {editingCompany ? 'Edit Company' : 'Add New Company'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="SolarTech Solutions"
            />
            <Select
              label="Company Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="utility">Utility</option>
              <option value="developer">Developer</option>
              <option value="epc">EPC</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="consultant">Consultant</option>
              <option value="government">Government</option>
            </Select>
            <Select
              label="Industry Segment"
              value={formData.industrySegment}
              onChange={(e) => setFormData({ ...formData, industrySegment: e.target.value as any })}
            >
              <option value="solar">Solar</option>
              <option value="wind">Wind</option>
              <option value="oil_gas">Oil & Gas</option>
              <option value="storage">Storage</option>
              <option value="grid">Grid</option>
              <option value="efficiency">Efficiency</option>
            </Select>
            <Select
              label="Company Size"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="enterprise">Enterprise</option>
            </Select>
            <Input
              label="City *"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Austin"
            />
            <Input
              label="State *"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="TX"
            />
            <Input
              label="Territory"
              value={formData.territory}
              onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
              placeholder="Southwest"
            />
            <Input
              label="Annual Revenue"
              type="number"
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              placeholder="50000000"
            />
            <Select
              label="Relationship Status"
              value={formData.relationshipStatus}
              onChange={(e) => setFormData({ ...formData, relationshipStatus: e.target.value as any })}
            >
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="competitor">Competitor</option>
            </Select>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={editingCompany ? handleEditCompany : handleAddCompany}>
              {editingCompany ? 'Update Company' : 'Add Company'}
            </Button>
          </div>
        </Card>
      )}

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedCompanies.map(company => {
          const TypeIcon = getTypeIcon(company.type);
          const SegmentIcon = getSegmentIcon(company.industrySegment);
          const contacts = getCompanyContacts(company.id);
          const deals = getCompanyDeals(company.id);
          const totalDealValue = getCompanyTotalDealValue(company.id);
          
          return (
            <Card key={company.id} className="relative overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                    <TypeIcon size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{company.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={getTypeColor(company.type)}>
                        {company.type}
                      </Badge>
                      <Badge variant={getSegmentColor(company.industrySegment)}>
                        <SegmentIcon size={12} className="mr-1" />
                        {company.industrySegment.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => startEdit(company)}
                    className="p-2"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteCompany(company.id)}
                    className="p-2"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              {/* Status and Size */}
              <div className="flex justify-between items-center mb-4">
                <Badge variant={getStatusColor(company.relationshipStatus)}>
                  {company.relationshipStatus}
                </Badge>
                <Badge variant={getSizeColor(company.size)}>
                  {company.size}
                </Badge>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-green-600 font-medium">Revenue</p>
                  <p className="text-lg font-bold text-green-700">
                    {company.revenue ? `$${(company.revenue / 1000000).toFixed(1)}M` : 'N/A'}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-blue-600 font-medium">Deal Value</p>
                  <p className="text-lg font-bold text-blue-700">
                    {totalDealValue > 0 ? `$${(totalDealValue / 1000000).toFixed(1)}M` : '$0'}
                  </p>
                </div>
              </div>

              {/* Relationship Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users size={16} className="text-gray-400" />
                  <span>{contacts.length} Contact{contacts.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Briefcase size={16} className="text-gray-400" />
                  <span>{deals.length} Deal{deals.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <MapPin size={16} className="text-gray-400" />
                <span>{company.location.city}, {company.location.state}</span>
              </div>

              {/* Territory */}
              {company.territory && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Territory:</strong> {company.territory}
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>Created: {company.createdDate.toLocaleDateString()}</span>
                </div>
                {company.lastContactDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>Last Contact: {company.lastContactDate.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
        {sortedCompanies.length === 0 && (
          <div className="col-span-3">
            <Card>
              <div className="text-center py-12">
                <Building size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedType !== 'all' || selectedSegment !== 'all' || selectedStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Start building your network by adding your first company'
                  }
                </p>
                {!searchTerm && selectedType === 'all' && selectedSegment === 'all' && selectedStatus === 'all' && (
                  <Button onClick={() => setShowAddForm(true)}>
                    Add Your First Company
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesView;