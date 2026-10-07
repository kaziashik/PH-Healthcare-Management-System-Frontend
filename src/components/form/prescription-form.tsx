"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreatePrescription } from "@/hooks/appointment.hook";
import { apiErrorMessage } from "@/utils";
import { prescriptionSchema } from "@/validation";

function emptyMedicine() {
  return {
    id: crypto.randomUUID(),
    name: "",
    dosage: "",
    duration: "",
    instructions: "",
  };
}

type MedicineErrors = {
  name?: string;
  dosage?: string;
  duration?: string;
};

type FormErrors = {
  findings?: string;
  medicines: MedicineErrors[];
};

function collectErrors(
  issues: { path: PropertyKey[]; message: string }[],
): FormErrors {
  const errors: FormErrors = { medicines: [] };

  for (const issue of issues) {
    const [root, index, key] = issue.path;
    if (root === "findings") {
      errors.findings ??= issue.message;
    }
    if (
      root === "medicines" &&
      typeof index === "number" &&
      (key === "name" || key === "dosage" || key === "duration")
    ) {
      errors.medicines[index] ??= {};
      errors.medicines[index][key] ??= issue.message;
    }
  }

  return errors;
}

export default function PrescriptionForm({
  appointmentId,
  onDone,
}: {
  appointmentId: string;
  onDone: () => void;
}) {
  const { mutate, isPending } = useCreatePrescription();
  const [findings, setFindings] = useState("");
  const [medicines, setMedicines] = useState([emptyMedicine()]);
  const [formErrors, setFormErrors] = useState<FormErrors>({ medicines: [] });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = prescriptionSchema.safeParse({
          appointmentId,
          findings,
          medicines: medicines.map(
            ({ name, dosage, duration, instructions }) => ({
              name,
              dosage,
              duration,
              instructions: instructions.trim() || undefined,
            }),
          ),
        });

        if (!parsed.success) {
          setFormErrors(collectErrors(parsed.error.issues));
          return;
        }

        setFormErrors({ medicines: [] });
        mutate(parsed.data, {
          onSuccess: (response) => {
            toast.add({
              title: "Prescription saved",
              description: response.message,
              type: "success",
            });
            onDone();
          },
          onError: (requestError) => {
            toast.add({
              title: "Could not save prescription",
              description: apiErrorMessage(requestError),
              type: "error",
            });
          },
        });
      }}
    >
      <FieldGroup>
        <Field data-invalid={Boolean(formErrors.findings)}>
          <FieldLabel htmlFor="findings">Findings</FieldLabel>
          <Textarea
            id="findings"
            value={findings}
            aria-invalid={Boolean(formErrors.findings)}
            onChange={(event) => {
              setFindings(event.target.value);
              setFormErrors((current) => ({ ...current, findings: undefined }));
            }}
          />
          {formErrors.findings ? (
            <FieldError errors={[{ message: formErrors.findings }]} />
          ) : null}
        </Field>

        {medicines.map((medicine, index) => (
          <div key={medicine.id} className="panel grid gap-3 p-4">
            <Field data-invalid={Boolean(formErrors.medicines[index]?.name)}>
              <FieldLabel htmlFor={`medicine-name-${index}`}>
                Medicine
              </FieldLabel>
              <Input
                id={`medicine-name-${index}`}
                value={medicine.name}
                aria-invalid={Boolean(formErrors.medicines[index]?.name)}
                onChange={(event) => {
                  const value = event.target.value;
                  setMedicines((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, name: value } : item,
                    ),
                  );
                  setFormErrors((current) => {
                    const medicines = [...current.medicines];
                    if (medicines[index]) {
                      medicines[index] = { ...medicines[index], name: undefined };
                    }
                    return { ...current, medicines };
                  });
                }}
              />
              {formErrors.medicines[index]?.name ? (
                <FieldError
                  errors={[{ message: formErrors.medicines[index]?.name }]}
                />
              ) : null}
            </Field>
            <Field data-invalid={Boolean(formErrors.medicines[index]?.dosage)}>
              <FieldLabel htmlFor={`medicine-dosage-${index}`}>
                Dosage
              </FieldLabel>
              <Input
                id={`medicine-dosage-${index}`}
                value={medicine.dosage}
                aria-invalid={Boolean(formErrors.medicines[index]?.dosage)}
                onChange={(event) => {
                  const value = event.target.value;
                  setMedicines((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, dosage: value } : item,
                    ),
                  );
                  setFormErrors((current) => {
                    const medicines = [...current.medicines];
                    if (medicines[index]) {
                      medicines[index] = {
                        ...medicines[index],
                        dosage: undefined,
                      };
                    }
                    return { ...current, medicines };
                  });
                }}
              />
              {formErrors.medicines[index]?.dosage ? (
                <FieldError
                  errors={[{ message: formErrors.medicines[index]?.dosage }]}
                />
              ) : null}
            </Field>
            <Field data-invalid={Boolean(formErrors.medicines[index]?.duration)}>
              <FieldLabel htmlFor={`medicine-duration-${index}`}>
                Duration
              </FieldLabel>
              <Input
                id={`medicine-duration-${index}`}
                value={medicine.duration}
                aria-invalid={Boolean(formErrors.medicines[index]?.duration)}
                onChange={(event) => {
                  const value = event.target.value;
                  setMedicines((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, duration: value }
                        : item,
                    ),
                  );
                  setFormErrors((current) => {
                    const medicines = [...current.medicines];
                    if (medicines[index]) {
                      medicines[index] = {
                        ...medicines[index],
                        duration: undefined,
                      };
                    }
                    return { ...current, medicines };
                  });
                }}
              />
              {formErrors.medicines[index]?.duration ? (
                <FieldError
                  errors={[{ message: formErrors.medicines[index]?.duration }]}
                />
              ) : null}
            </Field>
            <Field>
              <FieldLabel htmlFor={`medicine-instructions-${index}`}>
                Instructions
              </FieldLabel>
              <Input
                id={`medicine-instructions-${index}`}
                value={medicine.instructions}
                onChange={(event) =>
                  setMedicines((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, instructions: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </Field>
            {medicines.length > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setMedicines((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  );
                  setFormErrors((current) => ({
                    ...current,
                    medicines: current.medicines.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  }));
                }}
              >
                Remove medicine
              </Button>
            ) : null}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setMedicines((current) => [...current, emptyMedicine()]);
            setFormErrors((current) => ({
              ...current,
              medicines: [...current.medicines, {}],
            }));
          }}
        >
          Add medicine
        </Button>

        <Button disabled={isPending} type="submit">
          {isPending ? (
            <>
              <Spinner /> Saving
            </>
          ) : (
            "Save prescription"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
