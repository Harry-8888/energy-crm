import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Contact } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Plus, Edit, Trash2, Phone, Mail, Building } from 'lucide-react';

const ContactsView: React.FC = () => {
  const { state, dispatch } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    companyId: '',
    city: '',
    state: '',
    country: 'USA',
    territory: '',
    assignedUserId: '',
    status: 'active' as const,
    notes: ''
  });

  const filteredContacts = state.contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddContact = () => {
    if (!formData.name || !formData.email || !formData.companyId || !formData.assignedUserId) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: formData.name,
      title: formData.title,
      email: formData.email,
      phone: formData.phone,
      companyId: formData.companyId,
      location: {
        city: formData.city,
        state: formData.state,
        country: formData.country
      },
      territory: formData.territory,
      assignedUserId: formData.assignedUserId,
      status: formData.status,
      createdDate: new Date(),
      lastContactDate: new Date(),
      notes: formData.notes
    };

    dispatch({ type: 'ADD_CONTACT', payload: newContact });
    resetForm();
  };

  const handleEditContact = () => {
    if (!editingContact || !formData.name || !formData.email) return;

    const updatedContact: Contact = {
      ...editingContact,
      name: formData.name,
      title: formData.title,
      email: formData.email,
      phone: formData.phone,
      companyId: formData.companyId,
      location: {
        city: formData.city,
        state: formData.state,
        country: formData.country
      },
      territory: formData.territory,
      assignedUserId: formData.assignedUserId,
      status: formData.status,
      notes: formData.notes
    };

    dispatch({ type: 'UPDATE_CONTACT', payload: updatedContact });
    resetForm();
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      dispatch({ type: 'DELETE_CONTACT', payload: contactId });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      email: '',
      phone: '',
      companyId: '',
      city: '',
      state: '',
      country: 'USA',
      territory: '',
      assignedUserId: '',
      status: 'active',
      notes: ''
    });
    setShowAddForm(false);
    setEditingContact(null);
  };

  const startEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      title: contact.title,
      email: contact.email,
      phone: contact.phone,
      companyId: contact.companyId,
      city: contact.location.city,
      state: contact.location.state,
      country: contact.location.country,
      territory: contact.territory,
      assignedUserId: contact.assignedUserId,
      status: contact.status,
      notes: contact.notes || ''
    });
    setShowAddForm(true);
  };

  const getCompanyName = (companyId: string) => {
    const company = state.companies.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  const getUserName = (userId: string) => {
    const user = state.users.find(u => u.id === userId);
    return user?.name || 'Unassigned';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'do_not_contact': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="do_not_contact">Do Not Contact</option>
          </Select>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Contact</span>
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Smith"
            />
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VP of Development"
            />
            <Input
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@company.com"
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1-555-123-4567"
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
            <Input
              label="Territory"
              value={formData.territory}
              onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
              placeholder="Southwest"
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'do_not_contact' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="do_not_contact">Do Not Contact</option>
            </Select>
          </div>
          <div className="mt-4">
            <Input
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this contact..."
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={editingContact ? handleEditContact : handleAddContact}>
              {editingContact ? 'Update Contact' : 'Add Contact'}
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Contact</th>
                <th className="text-left py-3 px-4 font-medium">Company</th>
                <th className="text-left py-3 px-4 font-medium">Territory</th>
                <th className="text-left py-3 px-4 font-medium">Assigned To</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Last Contact</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map(contact => (
                <tr key={contact.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.title}</div>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Mail size={12} />
                          <span>{contact.email}</span>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Phone size={12} />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Building size={14} className="text-gray-400" />
                      <span className="text-sm">{getCompanyName(contact.companyId)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {contact.territory}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {getUserName(contact.assignedUserId)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusColor(contact.status)}>
                      {contact.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {contact.lastContactDate?.toLocaleDateString() || 'Never'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => startEdit(contact)}
                        className="flex items-center space-x-1"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="flex items-center space-x-1"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No contacts found matching your criteria.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ContactsView;