"use client";
export default function Dashboard() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Vendor Dashboard</h1>
      <p>Welcome! You have successfully logged in using httpOnly cookies.</p>
      <div style={{ marginTop: "20px", padding: "20px", border: "1px dashed gray" }}>
        <h3>Quick Stats</h3>
        <p>Active Services: 0</p>
        <p>Pending Approvals: 0</p>
      </div>
    </div>
  );
}