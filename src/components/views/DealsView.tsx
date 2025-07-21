import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Deal } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Plus, Edit, Trash2, DollarSign, Calendar, TrendingUp, MapPin, Building, Users, Zap, Wind, Fuel, Battery, Grid, Lightbulb } from 'lucide-react';

const DealsView: React.FC = () => {
  const { state, dispatch } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedProjectType, setSelectedProjectType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    companyId: '',
    contactId: '',
    projectType: 'solar_utility' as const,
    capacity: '',
    city: '',
    state: '',
    country: 'USA',
    value: '',
    probability: 50,
    stage: 'lead' as const,
    closeDate: new Date().toISOString().slice(0, 10),
    assignedUserId: '',
    notes: ''
  });

  const filteredDeals = state.deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || deal.stage === selectedStage;
    const matchesProjectType = selectedProjectType === 'all' || deal.projectType === selectedProjectType;
    return matchesSearch && matchesStage && matchesProjectType;
  });

  const sortedDeals = filteredDeals.sort((a, b) => b.value - a.value);

  const handleAddDeal = () => {
    if (!formData.name || !formData.companyId || !formData.contactId || !formData.assignedUserId || !formData.value) return;

    const newDeal: Deal = {
      id: Date.now().toString(),
      name: formData.name,
      companyId: formData.companyId,
      contactId: formData.contactId,
      projectType: formData.projectType,
      capacity: formData.capacity ? parseFloat(formData.capacity) : undefined,
      location: {
        city: formData.city,
        state: formData.state,
        country: formData.country
      },
      value: parseFloat(formData.value),
      probability: formData.probability,
      stage: formData.stage,
      closeDate: new Date(formData.closeDate),
      assignedUserId: formData.assignedUserId,
      createdDate: new Date(),
      lastActivityDate: new Date(),
      notes: formData.notes || undefined
    };

    dispatch({ type: 'ADD_DEAL', payload: newDeal });
    resetForm();
  };

  const handleEditDeal = () => {
    if (!editingDeal || !formData.name || !formData.companyId || !formData.contactId || !formData.value) return;

    const updatedDeal: Deal = {
      ...editingDeal,
      name: formData.name,
      companyId: formData.companyId,
      contactId: formData.contactId,
      projectType: formData.projectType,
      capacity: formData.capacity ? parseFloat(formData.capacity) : undefined,
      location: {
        city: formData.city,
        state: formData.state,
        country: formData.country
      },
      value: parseFloat(formData.value),
      probability: formData.probability,
      stage: formData.stage,
      closeDate: new Date(formData.closeDate),
      assignedUserId: formData.assignedUserId,
      notes: formData.notes || undefined
    };

    dispatch({ type: 'UPDATE_DEAL', payload: updatedDeal });
    resetForm();
  };

  const handleDeleteDeal = (dealId: string) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      dispatch({ type: 'DELETE_DEAL', payload: dealId });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      companyId: '',
      contactId: '',
      projectType: 'solar_utility',
      capacity: '',
      city: '',
      state: '',
      country: 'USA',
      value: '',
      probability: 50,
      stage: 'lead',
      closeDate: new Date().toISOString().slice(0, 10),
      assignedUserId: '',
      notes: ''
    });
    setShowAddForm(false);
    setEditingDeal(null);
  };

  const startEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      name: deal.name,
      companyId: deal.companyId,
      contactId: deal.contactId,
      projectType: deal.projectType,
      capacity: deal.capacity?.toString() || '',
      city: deal.location.city,
      state: deal.location.state,
      country: deal.location.country,
      value: deal.value.toString(),
      probability: deal.probability,
      stage: deal.stage,
      closeDate: new Date(deal.closeDate).toISOString().slice(0, 10),
      assignedUserId: deal.assignedUserId,
      notes: deal.notes || ''
    });
    setShowAddForm(true);
  };

  const getCompanyName = (companyId: string) => {
    const company = state.companies.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  const getContactName = (contactId: string) => {
    const contact = state.contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const getUserName = (userId: string) => {
    const user = state.users.find(u => u.id === userId);
    return user?.name || 'Unassigned';
  };

  const getProjectTypeIcon = (projectType: string) => {
    switch (projectType) {
      case 'solar_residential':
      case 'solar_commercial':
      case 'solar_utility':
        return Zap;
      case 'wind_onshore':
      case 'wind_offshore':
        return Wind;
      case 'oil_gas_upstream':
      case 'oil_gas_midstream':
      case 'oil_gas_downstream':
        return Fuel;
      case 'energy_storage':
        return Battery;
      case 'grid_infrastructure':
        return Grid;
      case 'energy_efficiency':
        return Lightbulb;
      default:
        return Zap;
    }
  };

  const getProjectTypeColor = (projectType: string) => {
    switch (projectType) {
      case 'solar_residential':
      case 'solar_commercial':
      case 'solar_utility':
        return 'warning'; // Yellow for solar
      case 'wind_onshore':
      case 'wind_offshore':
        return 'info'; // Blue for wind
      case 'oil_gas_upstream':
      case 'oil_gas_midstream':
      case 'oil_gas_downstream':
        return 'default'; // Gray for oil & gas
      case 'energy_storage':
        return 'success'; // Green for storage
      case 'grid_infrastructure':
        return 'danger'; // Red for grid
      case 'energy_efficiency':
        return 'info'; // Blue for efficiency
      default:
        return 'default';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'closed_won':
        return 'success';
      case 'closed_lost':
        return 'danger';
      case 'contract_review':
        return 'success';
      case 'negotiation':
        return 'warning';
      case 'proposal':
        return 'info';
      case 'needs_analysis':
        return 'info';
      case 'qualification':
        return 'default';
      case 'lead':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStageProgress = (stage: string) => {
    const stages = ['lead', 'qualification', 'needs_analysis', 'proposal', 'negotiation', 'contract_review', 'closed_won', 'closed_lost'];
    const currentIndex = stages.indexOf(stage);
    if (stage === 'closed_lost') return 0;
    if (stage === 'closed_won') return 100;
    return Math.round((currentIndex / (stages.length - 3)) * 100); // Excluding closed stages
  };

  const totalPipelineValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealValue = filteredDeals.length > 0 ? totalPipelineValue / filteredDeals.length : 0;
  const openDeals = filteredDeals.filter(deal => !['closed_won', 'closed_lost'].includes(deal.stage));

  return (
    <div className="space-y-8">
      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pipeline</p>
              <p className="text-2xl font-bold text-gradient">
                ${totalPipelineValue.toLocaleString()}
              </p>
            </div>
            <DollarSign size={32} className="text-green-500" />
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Deals</p>
              <p className="text-2xl font-bold text-gradient">
                {openDeals.length}
              </p>
            </div>
            <TrendingUp size={32} className="text-blue-500" />
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Deal Value</p>
              <p className="text-2xl font-bold text-gradient">
                ${Math.round(avgDealValue).toLocaleString()}
              </p>
            </div>
            <TrendingUp size={32} className="text-purple-500" />
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gradient">
                {filteredDeals.length > 0 ? 
                  Math.round((filteredDeals.filter(d => d.stage === 'closed_won').length / filteredDeals.length) * 100) : 0}%
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
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          <Select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
          >
            <option value="all">All Stages</option>
            <option value="lead">Lead</option>
            <option value="qualification">Qualification</option>
            <option value="needs_analysis">Needs Analysis</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="contract_review">Contract Review</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
          </Select>
          <Select
            value={selectedProjectType}
            onChange={(e) => setSelectedProjectType(e.target.value)}
          >
            <option value="all">All Project Types</option>
            <option value="solar_residential">Solar Residential</option>
            <option value="solar_commercial">Solar Commercial</option>
            <option value="solar_utility">Solar Utility</option>
            <option value="wind_onshore">Wind Onshore</option>
            <option value="wind_offshore">Wind Offshore</option>
            <option value="oil_gas_upstream">Oil & Gas Upstream</option>
            <option value="oil_gas_midstream">Oil & Gas Midstream</option>
            <option value="oil_gas_downstream">Oil & Gas Downstream</option>
            <option value="energy_storage">Energy Storage</option>
            <option value="grid_infrastructure">Grid Infrastructure</option>
            <option value="energy_efficiency">Energy Efficiency</option>
          </Select>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Deal</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gradient">
              {editingDeal ? 'Edit Deal' : 'Add New Deal'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Deal Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Austin Solar Farm - Phase 1"
            />
            <Select
              label="Company *"
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
            >
              <option value="">Select Company</option>
              {state.companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
            <Select
              label="Contact *"
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
            >
              <option value="">Select Contact</option>
              {state.contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </Select>
            <Select
              label="Project Type *"
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value as any })}
            >
              <option value="solar_residential">Solar Residential</option>
              <option value="solar_commercial">Solar Commercial</option>
              <option value="solar_utility">Solar Utility</option>
              <option value="wind_onshore">Wind Onshore</option>
              <option value="wind_offshore">Wind Offshore</option>
              <option value="oil_gas_upstream">Oil & Gas Upstream</option>
              <option value="oil_gas_midstream">Oil & Gas Midstream</option>
              <option value="oil_gas_downstream">Oil & Gas Downstream</option>
              <option value="energy_storage">Energy Storage</option>
              <option value="grid_infrastructure">Grid Infrastructure</option>
              <option value="energy_efficiency">Energy Efficiency</option>
            </Select>
            <Input
              label="Capacity (MW)"
              type="number"
              step="0.1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="100.0"
            />
            <Input
              label="Deal Value *"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="15000000"
            />
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Austin"
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="TX"
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Probability: {formData.probability}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <Select
              label="Stage"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
            >
              <option value="lead">Lead</option>
              <option value="qualification">Qualification</option>
              <option value="needs_analysis">Needs Analysis</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="contract_review">Contract Review</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </Select>
            <Input
              label="Expected Close Date"
              type="date"
              value={formData.closeDate}
              onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
            />
            <Select
              label="Assigned User *"
              value={formData.assignedUserId}
              onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
            >
              <option value="">Select User</option>
              {state.users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-6">
            <Input
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this deal..."
            />
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={editingDeal ? handleEditDeal : handleAddDeal}>
              {editingDeal ? 'Update Deal' : 'Add Deal'}
            </Button>
          </div>
        </Card>
      )}

      {/* Deals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedDeals.map(deal => {
          const ProjectIcon = getProjectTypeIcon(deal.projectType);
          const progressPercentage = getStageProgress(deal.stage);
          
          return (
            <Card key={deal.id} className="relative overflow-hidden">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-600 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex justify-between items-start mb-4 pt-2">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                    <ProjectIcon size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{deal.name}</h3>
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant={getProjectTypeColor(deal.projectType)}>
                        {deal.projectType.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getStageColor(deal.stage)}>
                        {deal.stage.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => startEdit(deal)}
                    className="p-2"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteDeal(deal.id)}
                    className="p-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Deal Value and Probability */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Deal Value</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${deal.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Probability</p>
                    <p className="text-2xl font-bold text-blue-600">{deal.probability}%</p>
                  </div>
                </div>

                {/* Company and Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Building size={16} className="text-gray-400" />
                    <span className="text-gray-600">{getCompanyName(deal.companyId)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-gray-600">{getContactName(deal.contactId)}</span>
                  </div>
                </div>

                {/* Location and Capacity */}
                {(deal.location.city || deal.capacity) && (
                  <div className="grid grid-cols-2 gap-4">
                    {deal.location.city && (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-gray-600">{deal.location.city}, {deal.location.state}</span>
                      </div>
                    )}
                    {deal.capacity && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Zap size={16} className="text-gray-400" />
                        <span className="text-gray-600">{deal.capacity} MW</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline */}
                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} />
                    <span>Close: {new Date(deal.closeDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={14} />
                    <span>{getUserName(deal.assignedUserId)}</span>
                  </div>
                </div>

                {deal.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    <strong>Notes: </strong>{deal.notes}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
        {sortedDeals.length === 0 && (
          <div className="col-span-2">
            <Card>
              <div className="text-center py-12">
                <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedStage !== 'all' || selectedProjectType !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start building your pipeline by adding your first deal'
                  }
                </p>
                {!searchTerm && selectedStage === 'all' && selectedProjectType === 'all' && (
                  <Button onClick={() => setShowAddForm(true)}>
                    Add Your First Deal
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

export default DealsView;