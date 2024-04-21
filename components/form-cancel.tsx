import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';

interface FormCancelProps {
  isLoading: boolean;
}

export function FormCancel({ isLoading }: FormCancelProps) {
  const form = useFormContext();

  const { formState, reset } = form;

  return (
    <Button
      variant='ghost'
      size='sm'
      disabled={!formState.isDirty || !formState.touchedFields || isLoading}
      onClick={() => {
        reset();
      }}
    >
      Cancel
    </Button>
  );
}
