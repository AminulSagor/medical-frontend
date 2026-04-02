"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ComposeBroadcastSchema,
  type ComposeBroadcastInput,
} from "../_lib/compose-schema";

export default function ComposeFormProvider({
  defaultValues,
  children,
}: {
  defaultValues: ComposeBroadcastInput;
  children: React.ReactNode;
}) {
  const form = useForm<ComposeBroadcastInput>({
    resolver: zodResolver(ComposeBroadcastSchema),
    mode: "onChange",
    defaultValues,
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}