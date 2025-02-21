import React, { useState } from 'react';
import { Modal, Picker, TextInput, Button } from 'react-native';

interface TimWoodsAndon {
  type: 'Transportation' | 'Inventory' | 'Motion' | 'Waiting' | 
        'Overproduction' | 'Overprocessing' | 'Defects' | 'Skills';
  description: string;
  timestamp: Date;
}

interface AndonDialogProps {
  onSubmit: (andonNote: TimWoodsAndon) => void;
  onClose: () => void;
}

export function AndonDialog({ onSubmit, onClose }: AndonDialogProps) {
  const [type, setType] = useState<TimWoodsAndon['type']>('Waiting');
  const [description, setDescription] = useState('');

  return (
    <Modal>
      <Picker
        selectedValue={type}
        onValueChange={setType}
        items={[
          'Transportation', 'Inventory', 'Motion', 'Waiting',
          'Overproduction', 'Overprocessing', 'Defects', 'Skills'
        ]}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the waste observed..."
        multiline
      />
      <Button 
        title="Log Waste"
        onPress={() => onSubmit({ type, description, timestamp: new Date() })}
      />
      <Button 
        title="Close"
        onPress={onClose}
      />
    </Modal>
  );
}
