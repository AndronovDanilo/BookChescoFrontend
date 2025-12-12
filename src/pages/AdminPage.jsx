import React from 'react';
import AdminPanel from '../features/admin/AdminPanel';
import PageShell from '../widgets/PageShell/PageShell';

function AdminPage({ onOpenAuth }) {
    return (
        <PageShell onOpenAuth={onOpenAuth}>
            <AdminPanel />
        </PageShell>
    );
}

export default AdminPage;