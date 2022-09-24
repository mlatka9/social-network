import CategoryList from '@/components/community/categories-list';
import Button from '../common/button';

interface MobileCategoryPanelProps {
  handleOpenCreator: () => void;
}

const MobileCategoryPanel = ({
  handleOpenCreator,
}: MobileCategoryPanelProps) => (
  <div className="lg:hidden ">
    <Button
      className="fixed bottom-2 right-2 rounded-full w-min text-sm shadow-lg"
      onClick={handleOpenCreator}
    >
      Create community
    </Button>
    <CategoryList />
    <div className="mb-2" />
  </div>
);

export default MobileCategoryPanel;
