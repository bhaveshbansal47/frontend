"use client";

import AccessTokenInput from "./access-token-input";
import { ComplianceCheck } from "./compliance-check";
import {
  SupabaseContextProvider,
  useSupabase,
} from "./supabase-context-provider";

export default function Supabase() {
  return (
    <SupabaseContextProvider>
      <SupabaseComponent />
    </SupabaseContextProvider>
  );
}

function SupabaseComponent() {
  const supabase = useSupabase();
  if (!supabase.accessToken) {
    return <AccessTokenInput />;
  }
  return <ComplianceCheck />;
}
