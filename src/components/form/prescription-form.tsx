"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
  const [error, setError] = useState("");

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
          setError(parsed.error.issues[0]?.message ?? "Check the prescription");
          return;
        }

        setError("");
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
        <Field>
          <FieldLabel htmlFor="findings">Findings</FieldLabel>
          <Textarea
            id="findings"
            value={findings}
            onChange={(event) => setFindings(event.target.value)}
          />
        </Field>

        {medicines.map((medicine, index) => (
          <div key={medicine.id} className="grid gap-3 rounded-lg border p-3">
            <Field>
              <FieldLabel htmlFor={`medicine-name-${index}`}>
                Medicine
              </FieldLabel>
              <Input
                id={`medicine-name-${index}`}
                value={medicine.name}
                onChange={(event) =>
                  setMedicines((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, name: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`medicine-dosage-${index}`}>
                Dosage
              </FieldLabel>
              <Input
                id={`medicine-dosage-${index}`}
                value={medicine.dosage}
                onChange={(event) =>
                  setMedicines((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, dosage: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`medicine-duration-${index}`}>
                Duration
              </FieldLabel>
              <Input
                id={`medicine-duration-${index}`}
                value={medicine.duration}
                onChange={(event) =>
                  setMedicines((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, duration: event.target.value }
                        : item,
                    ),
                  )
                }
              />
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
                onClick={() =>
                  setMedicines((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                Remove medicine
              </Button>
            ) : null}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setMedicines((current) => [...current, emptyMedicine()])
          }
        >
          Add medicine
        </Button>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

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
