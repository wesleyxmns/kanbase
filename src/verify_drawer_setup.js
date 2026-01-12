import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
export function VerifyDrawer() {
    return (_jsxs(Sheet, { children: [_jsx(SheetTrigger, { asChild: true, children: _jsx(Button, { children: "Open Drawer" }) }), _jsx(SheetContent, { children: _jsx("div", { children: "Drawer Content" }) })] }));
}
