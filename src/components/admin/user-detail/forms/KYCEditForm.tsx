"use client";

interface KYCEditFormProps {
  formData: Record<string, unknown>;
  setFormData: (data: Record<string, unknown>) => void;
}

export default function KYCEditForm({
  formData,
  setFormData,
}: KYCEditFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="kycStatus"
          className="block text-sm font-medium text-gray-700"
        >
          KYC Status
        </label>
        <select
          id="kycStatus"
          value={(formData.status as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select status</option>
          <option value="not_started">Not Started</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="requires_more">Requires More Info</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="kycLevel"
          className="block text-sm font-medium text-gray-700"
        >
          KYC Level
        </label>
        <select
          id="kycLevel"
          value={(formData.level as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              level: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select level</option>
          <option value="basic">Basic</option>
          <option value="enhanced">Enhanced</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="riskLevel"
          className="block text-sm font-medium text-gray-700"
        >
          Risk Level
        </label>
        <select
          id="riskLevel"
          value={(formData.riskLevel as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              riskLevel: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select risk level</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="provider"
          className="block text-sm font-medium text-gray-700"
        >
          KYC Provider
        </label>
        <select
          id="provider"
          value={(formData.provider as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              provider: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select provider</option>
          <option value="mock">Mock Provider</option>
          <option value="jumio">Jumio</option>
          <option value="onfido">Onfido</option>
          <option value="persona">Persona</option>
          <option value="veriff">Veriff</option>
          <option value="sumsub">Sum&Substance</option>
          <option value="shufti_pro">Shufti Pro</option>
          <option value="trulioo">Trulioo</option>
          <option value="au10tix">AU10TIX</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="externalId"
          className="block text-sm font-medium text-gray-700"
        >
          External ID
        </label>
        <input
          type="text"
          id="externalId"
          value={(formData.externalId as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              externalId: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Provider's reference ID"
        />
      </div>

      <div>
        <label
          htmlFor="reviewedBy"
          className="block text-sm font-medium text-gray-700"
        >
          Reviewed By
        </label>
        <input
          type="text"
          id="reviewedBy"
          value={(formData.reviewedBy as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              reviewedBy: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Reviewer email or ID"
        />
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="nextReviewDue"
          className="block text-sm font-medium text-gray-700"
        >
          Next Review Due
        </label>
        <input
          type="datetime-local"
          id="nextReviewDue"
          value={(formData.nextReviewDue as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              nextReviewDue: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="rejectionReason"
          className="block text-sm font-medium text-gray-700"
        >
          Rejection Reason
        </label>
        <textarea
          id="rejectionReason"
          value={(formData.rejectionReason as string) || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              rejectionReason: e.target.value,
            })
          }
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter rejection reason (if applicable)"
        />
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="complianceNote"
          className="block text-sm font-medium text-gray-700"
        >
          Add Compliance Note
        </label>
        <div className="mt-1 space-y-2">
          <select
            value={(formData.noteType as string) || "info"}
            onChange={(e) =>
              setFormData({
                ...formData,
                noteType: e.target.value,
              })
            }
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
          <textarea
            id="complianceNote"
            value={(formData.complianceNote as string) || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                complianceNote: e.target.value,
              })
            }
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter compliance note (optional)"
          />
        </div>
      </div>
    </div>
  );
}