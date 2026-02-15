import React, { memo, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface JoditComponentProps {
  content: string;
  setContent: (content: string) => void;
}

const JoditComponent = ({ content, setContent }: JoditComponentProps) => {
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    toolbarSticky: false,
    minHeight: 600,
  }), []);

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content || ''}
        onBlur={(newContent) => setContent(newContent)}
        config={config}
      />
    </div>
  );
};

export default memo(JoditComponent);