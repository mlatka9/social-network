import CategoryList from '@/components/community/categories-list';
import BackButton from '../common/back-button';
import Button from '../common/button';

interface DestopCategoryPanelProps {
  handleOpenCreator: () => void;
}

const DestopCategoryPanel = ({
  handleOpenCreator,
}: DestopCategoryPanelProps) => (
  <div className="hidden lg:block h-fit sticky top-[92px] space-y-5 h-[calc(100vh-92px)]">
    <BackButton />
    <div className="overflow-y-scroll rounded-xl max-h-[calc(100%-120px)]">
      <CategoryList />
    </div>
    <Button className="w-full" onClick={handleOpenCreator}>
      Create community
    </Button>
  </div>
);

export default DestopCategoryPanel;
