import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Save, X } from 'lucide-react';
import './CMSManagement.css';

const CMSManagement = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('/api/admin/cms', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching CMS content:', error);
            setLoading(false);
        }
    };

    const handleEdit = (content) => {
        setEditingId(content._id);
        setFormData({ ...content });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async (key) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`/api/admin/cms/${key}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingId(null);
            fetchContent();
            alert('Content updated successfully');
        } catch (error) {
            alert('Error updating content: ' + error.response?.data?.message);
        }
    };

    // Group content by section
    const groupedContent = contents.reduce((acc, item) => {
        (acc[item.section] = acc[item.section] || []).push(item);
        return acc;
    }, {});

    return (
        <div className="cms-management">
            <div className="page-header">
                <h1>CMS Content Manager</h1>
                <p>Edit website text, pages, and SEO metadata</p>
            </div>

            {loading ? (
                <div className="loading">Loading content...</div>
            ) : Object.keys(groupedContent).length === 0 ? (
                <div className="empty-state">No CMS content found. Run seed script to populate.</div>
            ) : (
                Object.entries(groupedContent).map(([section, items]) => (
                    <div key={section} className="section-card">
                        <h2 className="section-title">{section.charAt(0).toUpperCase() + section.slice(1)} Section</h2>
                        <div className="content-grid">
                            {items.map(item => (
                                <div key={item._id} className="content-card">
                                    <div className="content-header">
                                        <h3>{item.title}</h3>
                                        {editingId !== item._id && (
                                            <button className="btn-edit" onClick={() => handleEdit(item)}>
                                                <Edit size={16} /> Edit
                                            </button>
                                        )}
                                    </div>

                                    {editingId === item._id ? (
                                        <div className="edit-form">
                                            <div className="form-group">
                                                <label>Title</label>
                                                <input
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Description/Content</label>
                                                <textarea
                                                    name="content"
                                                    value={formData.content || formData.description}
                                                    onChange={handleChange}
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="edit-actions">
                                                <button className="btn-save" onClick={() => handleSave(item.key)}>
                                                    <Save size={16} /> Save
                                                </button>
                                                <button className="btn-cancel" onClick={handleCancel}>
                                                    <X size={16} /> Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="content-preview">
                                            <p className="preview-text">{item.content || item.description}</p>
                                            <small className="key-badge">{item.key}</small>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CMSManagement;
