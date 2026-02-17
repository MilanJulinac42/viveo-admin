"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import { getApplication, updateApplicationStatus } from "@/lib/api/admin";
import { formatDateTime } from "@/lib/utils";
import type { ApplicationDetail } from "@/lib/types";

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    getApplication(id)
      .then((res) => setApp(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAction(status: "approved" | "rejected") {
    if (!app) return;
    setUpdating(true);
    try {
      const res = await updateApplicationStatus(app.id, status);
      setApp(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  if (loading || !app) return <PageLoading />;

  return (
    <>
      <AdminHeader
        title={app.fullName}
        description={`Prijava od ${formatDateTime(app.createdAt)}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              ← Nazad
            </Button>
            {app.status === "pending" && (
              <>
                <Button
                  variant="primary"
                  onClick={() => handleAction("approved")}
                  disabled={updating}
                >
                  Odobri
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleAction("rejected")}
                  disabled={updating}
                >
                  Odbij
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
              {app.reviewedAt && (
                <span className="text-xs text-gray-400">
                  Pregledano: {formatDateTime(app.reviewedAt)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Ime</p>
                <p className="text-gray-900 font-medium">{app.fullName}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p className="text-gray-900">{app.email}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Telefon</p>
                <p className="text-gray-900">{app.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Kategorija</p>
                <p className="text-gray-900">{app.category}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Broj pratilaca</p>
                <p className="text-gray-900">{app.followers}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Društvene mreže</p>
                <a
                  href={app.socialMedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  {app.socialMedia}
                </a>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Biografija</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{app.bio}</p>
          </div>

          {/* Motivation */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Motivacija</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {app.motivation}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Akcije</h3>
            {app.status === "pending" ? (
              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="primary"
                  onClick={() => handleAction("approved")}
                  disabled={updating}
                >
                  ✓ Odobri prijavu
                </Button>
                <Button
                  fullWidth
                  variant="danger"
                  onClick={() => handleAction("rejected")}
                  disabled={updating}
                >
                  ✕ Odbij prijavu
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Ova prijava je već{" "}
                {app.status === "approved" ? "odobrena" : "odbijena"}.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
