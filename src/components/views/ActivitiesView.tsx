import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Activity } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Plus, Edit, Trash2, Phone, Mail, Users, MapPin, Calendar, Clock, Target, CheckCircle, XCircle } from 'lucide-react';

const ActivitiesView: React.FC = () => {
  const { state, dispatch } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedOutcome, setSelectedOutcome] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    type: 'phone_call' as const,
    subject: '',
    description: '',
    contactId: '',
    dealId: '',
    userId: '',
    date: new Date().toISOString().slice(0, 16),
    duration: '',
    outcome: 'neutral' as const,
    nextSteps: '',
    followUpDate: ''
  });

  const filteredActivities = state.activities.filter(activity => {
    const matchesSearch = activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    const matchesOutcome = selectedOutcome === 'all' || activity.outcome === selectedOutcome;
    return matchesSearch && matchesType && matchesOutcome;
  });

  const sortedActivities = filteredActivities.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAddActivity = () => {
    if (!formData.subject || !formData.description || !formData.userId) return;

    const newActivity: Activity = {
      id: Date.now().toString(),
      type: formData.type,
      subject: formData.subject,
      description: formData.description,
      contactId: formData.contactId || undefined,
      dealId: formData.dealId || undefined,
      userId: formData.userId,
      date: new Date(formData.date),
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      outcome: formData.outcome,
      nextSteps: formData.nextSteps || undefined,
      followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : undefined,
      createdDate: new Date()
    };

    dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
    resetForm();
  };

  const handleEditActivity = () => {
    if (!editingActivity || !formData.subject || !formData.description) return;

    const updatedActivity: Activity = {
      ...editingActivity,
      type: formData.type,
      subject: formData.subject,
      description: formData.description,
      contactId: formData.contactId || undefined,
      dealId: formData.dealId || undefined,
      userId: formData.userId,
      date: new Date(formData.date),
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      outcome: formData.outcome,
      nextSteps: formData.nextSteps || undefined,
      followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : undefined
    };

    dispatch({ type: 'UPDATE_ACTIVITY', payload: updatedActivity });
    resetForm();
  };

  const handleDeleteActivity = (activityId: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      dispatch({ type: 'DELETE_ACTIVITY', payload: activityId });
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'phone_call',
      subject: '',
      description: '',
      contactId: '',
      dealId: '',
      userId: '',
      date: new Date().toISOString().slice(0, 16),
      duration: '',
      outcome: 'neutral',
      nextSteps: '',
      followUpDate: ''
    });
    setShowAddForm(false);
    setEditingActivity(null);
  };

  const startEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      type: activity.type,
      subject: activity.subject,
      description: activity.description,
      contactId: activity.contactId || '',
      dealId: activity.dealId || '',
      userId: activity.userId,
      date: new Date(activity.date).toISOString().slice(0, 16),
      duration: activity.duration?.toString() || '',
      outcome: activity.outcome || 'neutral',
      nextSteps: activity.nextSteps || '',
      followUpDate: activity.followUpDate ? new Date(activity.followUpDate).toISOString().slice(0, 16) : ''
    });
    setShowAddForm(true);
  };

  const getContactName = (contactId?: string) => {
    if (!contactId) return 'No contact';
    const contact = state.contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const getDealName = (dealId?: string) => {
    if (!dealId) return 'No deal';
    const deal = state.deals.find(d => d.id === dealId);
    return deal?.name || 'Unknown Deal';
  };

  const getUserName = (userId: string) => {
    const user = state.users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone_call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Users;
      case 'site_visit': return MapPin;
      default: return Target;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'phone_call': return 'info';
      case 'email': return 'default';
      case 'meeting': return 'success';
      case 'site_visit': return 'warning';
      case 'proposal_submission': return 'info';
      case 'technical_review': return 'default';
      case 'contract_discussion': return 'success';
      default: return 'default';
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'positive': return 'success';
      case 'negative': return 'danger';
      case 'neutral': return 'default';
      default: return 'default';
    }
  };

  const getOutcomeIcon = (outcome?: string) => {
    switch (outcome) {
      case 'positive': return CheckCircle;
      case 'negative': return XCircle;
      default: return Target;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="phone_call">Phone Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="site_visit">Site Visit</option>
            <option value="proposal_submission">Proposal Submission</option>
            <option value="technical_review">Technical Review</option>
            <option value="contract_discussion">Contract Discussion</option>
          </Select>
          <Select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value)}
          >
            <option value="all">All Outcomes</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </Select>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Activity</span>
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gradient">
              {editingActivity ? 'Edit Activity' : 'Add New Activity'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Activity Type *"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="phone_call">Phone Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="site_visit">Site Visit</option>
              <option value="proposal_submission">Proposal Submission</option>
              <option value="technical_review">Technical Review</option>
              <option value="contract_discussion">Contract Discussion</option>
            </Select>
            <Input
              label="Subject *"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief description of activity"
            />
            <Select
              label="Contact"
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
            >
              <option value="">Select Contact (Optional)</option>
              {state.contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </Select>
            <Select
              label="Deal"
              value={formData.dealId}
              onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
            >
              <option value="">Select Deal (Optional)</option>
              {state.deals.map(deal => (
                <option key={deal.id} value={deal.id}>
                  {deal.name}
                </option>
              ))}
            </Select>
            <Select
              label="Assigned User *"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            >
              <option value="">Select User</option>
              {state.users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
            <Input
              label="Date & Time *"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="60"
            />
            <Select
              label="Outcome"
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value as 'positive' | 'neutral' | 'negative' })}
            >
              <option value="neutral">Neutral</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </Select>
            <Input
              label="Follow-up Date"
              type="datetime-local"
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
            />
          </div>
          <div className="mt-6 space-y-4">
            <Input
              label="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of what happened..."
            />
            <Input
              label="Next Steps"
              value={formData.nextSteps}
              onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
              placeholder="What needs to be done next..."
            />
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={editingActivity ? handleEditActivity : handleAddActivity}>
              {editingActivity ? 'Update Activity' : 'Add Activity'}
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {sortedActivities.map(activity => {
          const TypeIcon = getTypeIcon(activity.type);
          const OutcomeIcon = getOutcomeIcon(activity.outcome);
          
          return (
            <Card key={activity.id} className="relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${
                    activity.outcome === 'positive' ? 'bg-green-100' :
                    activity.outcome === 'negative' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <TypeIcon size={24} className={`${
                      activity.outcome === 'positive' ? 'text-green-600' :
                      activity.outcome === 'negative' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{activity.subject}</h3>
                      <Badge variant={getTypeColor(activity.type)}>
                        {activity.type.replace('_', ' ')}
                      </Badge>
                      {activity.outcome && (
                        <Badge variant={getOutcomeColor(activity.outcome)}>
                          <OutcomeIcon size={12} className="mr-1" />
                          {activity.outcome}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{activity.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      {activity.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{activity.duration} min</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{getUserName(activity.userId)}</span>
                      </div>
                    </div>
                    {(activity.contactId || activity.dealId) && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {activity.contactId && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <span className="font-medium text-blue-900">Contact: </span>
                            <span className="text-blue-700">{getContactName(activity.contactId)}</span>
                          </div>
                        )}
                        {activity.dealId && (
                          <div className="bg-green-50 rounded-lg p-3">
                            <span className="font-medium text-green-900">Deal: </span>
                            <span className="text-green-700">{getDealName(activity.dealId)}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {activity.nextSteps && (
                      <div className="mt-3 bg-yellow-50 rounded-lg p-3">
                        <span className="font-medium text-yellow-900">Next Steps: </span>
                        <span className="text-yellow-700">{activity.nextSteps}</span>
                      </div>
                    )}
                    {activity.followUpDate && (
                      <div className="mt-3 bg-purple-50 rounded-lg p-3">
                        <span className="font-medium text-purple-900">Follow-up: </span>
                        <span className="text-purple-700">
                          {new Date(activity.followUpDate).toLocaleDateString()} at{' '}
                          {new Date(activity.followUpDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => startEdit(activity)}
                    className="p-2"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="p-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        {sortedActivities.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedType !== 'all' || selectedOutcome !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start tracking your sales activities by adding your first activity'
                }
              </p>
              {!searchTerm && selectedType === 'all' && selectedOutcome === 'all' && (
                <Button onClick={() => setShowAddForm(true)}>
                  Add Your First Activity
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActivitiesView;