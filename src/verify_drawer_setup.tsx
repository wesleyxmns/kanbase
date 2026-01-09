
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';

export function VerifyDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Drawer</Button>
      </SheetTrigger>
      <SheetContent>
        <div>Drawer Content</div>
      </SheetContent>
    </Sheet>
  );
}
