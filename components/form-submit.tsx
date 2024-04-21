import { LoaderCircle, Save } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';

interface FormSubmitProps {
  isLoading: boolean;
}

export function FormSubmit({ isLoading }: FormSubmitProps) {
  const form = useFormContext();

  const { formState } = form;
  return (
    <Button
      type='submit'
      size='sm'
      disabled={!formState.isDirty || !formState.touchedFields || isLoading}
    >
      {isLoading ? (
        <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
      ) : (
        <Save className='mr-2 w-4 h-4' />
      )}
      Save
    </Button>
  );
}
