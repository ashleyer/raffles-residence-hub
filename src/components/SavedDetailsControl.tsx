import { toast } from "sonner";
import { ShieldOff } from "lucide-react";
import { usePortal, REMEMBER_TTL_MS } from "@/lib/portal-store";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const REMEMBER_DAYS = Math.round(REMEMBER_TTL_MS / (24 * 60 * 60 * 1000));

/** One-click removal of the residence and contact details kept in this browser
 *  by "Remember me". Signing out is unaffected; the profile itself is kept. */
export function SavedDetailsControl() {
  const { rememberedEmail, rememberedUnit, clearSavedDetails } = usePortal();
  const hasSaved = Boolean(rememberedEmail || rememberedUnit);

  return (
    <section className="mt-8 border-t border-border pt-6">
      <h3 className="flex items-center gap-2 text-lg">
        <ShieldOff className="h-4 w-4 text-primary" aria-hidden="true" />
        Saved residence details
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {hasSaved ? (
          <>
            This browser is remembering{" "}
            <span className="text-foreground">{rememberedEmail}</span>
            {rememberedUnit ? (
              <>
                {" "}
                and residence <span className="text-foreground">{rememberedUnit}</span>
              </>
            ) : null}{" "}
            for up to {REMEMBER_DAYS} days so sign-in is prefilled. You may remove it at any time.
          </>
        ) : (
          <>Nothing is saved on this browser. Enable “Remember me” at sign-in if you would like it prefilled.</>
        )}
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={!hasSaved}
            className="mt-4 min-h-11 w-full tracking-[0.18em] uppercase sm:w-auto"
          >
            Clear saved residence details
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear saved residence details?</AlertDialogTitle>
            <AlertDialogDescription>
              The remembered email address and residence number will be erased from this browser
              immediately. Your account, household profile and current session are untouched — you
              will simply need to type your details the next time you sign in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11">Keep them</AlertDialogCancel>
            <AlertDialogAction
              className="min-h-11"
              onClick={() => {
                clearSavedDetails();
                toast.success("Saved residence details cleared from this browser.");
              }}
            >
              Clear now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
