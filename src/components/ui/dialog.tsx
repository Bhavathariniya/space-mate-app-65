import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// Add VisuallyHidden component for accessibility
const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0",
      className
    )}
    {...props}
  />
))
VisuallyHidden.displayName = "VisuallyHidden"

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  // Generate unique IDs for accessibility
  const titleId = React.useId();
  const descriptionId = React.useId();
  
  // Analyze children to find title and description
  const childArray = React.Children.toArray(children);
  
  // Check for DialogTitle component
  const hasDialogTitle = childArray.some(child => {
    if (!React.isValidElement(child)) return false;
    
    // Direct DialogTitle
    if (child.type === DialogTitle) return true;
    
    // DialogTitle inside DialogHeader
    if (child.type === DialogHeader && child.props.children) {
      const headerChildren = React.Children.toArray(child.props.children);
      return headerChildren.some(headerChild => 
        React.isValidElement(headerChild) && headerChild.type === DialogTitle
      );
    }
    
    // Check for nested components that might contain DialogTitle
    if (child.props && child.props.children) {
      const nestedChildren = React.Children.toArray(child.props.children);
      return nestedChildren.some(nestedChild => 
        React.isValidElement(nestedChild) && 
        (nestedChild.type === DialogTitle || 
         (nestedChild.type === DialogHeader && 
          React.Children.toArray(nestedChild.props?.children || []).some(
            headerChild => React.isValidElement(headerChild) && headerChild.type === DialogTitle
          ))
        )
      );
    }
    
    return false;
  });
  
  // Check for DialogDescription component
  const hasDialogDescription = childArray.some(child => {
    if (!React.isValidElement(child)) return false;
    
    // Direct DialogDescription
    if (child.type === DialogDescription) return true;
    
    // DialogDescription inside DialogHeader
    if (child.type === DialogHeader && child.props.children) {
      const headerChildren = React.Children.toArray(child.props.children);
      return headerChildren.some(headerChild => 
        React.isValidElement(headerChild) && headerChild.type === DialogDescription
      );
    }
    
    // Check for nested components that might contain DialogDescription
    if (child.props && child.props.children) {
      const nestedChildren = React.Children.toArray(child.props.children);
      return nestedChildren.some(nestedChild => 
        React.isValidElement(nestedChild) && 
        (nestedChild.type === DialogDescription || 
         (nestedChild.type === DialogHeader && 
          React.Children.toArray(nestedChild.props?.children || []).some(
            headerChild => React.isValidElement(headerChild) && headerChild.type === DialogDescription
          ))
        )
      );
    }
    
    return false;
  });

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        aria-labelledby={titleId}
        aria-describedby={hasDialogDescription ? descriptionId : undefined}
        {...props}
      >
        {!hasDialogTitle && (
          <VisuallyHidden>
            <DialogTitle id={titleId}>Dialog Content</DialogTitle>
          </VisuallyHidden>
        )}
        {!hasDialogDescription && (
          <VisuallyHidden>
            <DialogDescription id={descriptionId}>Dialog content for accessibility</DialogDescription>
          </VisuallyHidden>
        )}
        
{children}
        
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  VisuallyHidden,
}
