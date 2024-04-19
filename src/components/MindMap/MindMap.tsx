export interface MindMapProps {
    test: string;
}

const MindMap = ({ test }: MindMapProps) => {
    return <b> {`hi from mind map ${test}`} </b>;
};

export default MindMap;
