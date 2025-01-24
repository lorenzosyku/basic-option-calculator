import React, { useState, useCallback } from "react";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/auth/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

import { SavedCalculation, SavedCalculationsProps } from "../../types/optionCalcTypes";

const SavedCalculations: React.FC<SavedCalculationsProps> = ({
  userId,
  currentCalculation,
}) => {
  const [savedCalculations, setSavedCalculations] = useState<
    SavedCalculation[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculationNotes, setCalculationNotes] = useState<string>("");

  // Track last save timestamp and save count
  const [lastSaveTimestamp, setLastSaveTimestamp] = useState<number>(0);
  const [dailySaveCount, setDailySaveCount] = useState<number>(0);

  // Debounce and rate limit save function
  const saveCalculation = useCallback(async () => {
    if (!currentCalculation.results) return;

    const now = Date.now();
    const MIN_SAVE_INTERVAL = 5000; // 5 seconds between saves
    const MAX_DAILY_SAVES = 25; // Maximum 25 saves per day

    // Check time since last save
    if (now - lastSaveTimestamp < MIN_SAVE_INTERVAL) {
      setError("Please wait before saving again");
      return;
    }

    // Check daily save limit
    if (dailySaveCount >= MAX_DAILY_SAVES) {
      setError("Daily save limit reached. Try again tomorrow.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      // Check recent saves from today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const savesQuery = query(
        collection(db, "calculations"),
        where("userId", "==", userId),
        where("createdAt", ">=", Timestamp.fromDate(todayStart))
      );

      const savesSnapshot = await getDocs(savesQuery);
      const todaySaveCount = savesSnapshot.size;

      if (todaySaveCount >= MAX_DAILY_SAVES) {
        setError("Daily save limit reached. Try again tomorrow.");
        setIsSaving(false);
        return;
      }

      const calculationData: SavedCalculation = {
        userId,
        stockPrice: currentCalculation.stockPrice,
        positions: currentCalculation.positions,
        results: currentCalculation.results,
        createdAt: Timestamp.now(),
        calculationNotes,
      };

      const docRef = await addDoc(
        collection(db, "calculations"),
        calculationData
      );

      setSavedCalculations((prev) => [
        {
          ...calculationData,
          id: docRef.id,
        },
        ...prev,
      ]);

      // Update save tracking
      setLastSaveTimestamp(now);
      setDailySaveCount((prevCount) => prevCount + 1);

      // Reset notes after saving
      setCalculationNotes("");
    } catch (error) {
      console.error("Error saving calculation:", error);
      setError("Failed to save calculation");
    } finally {
      setIsSaving(false);
    }
  }, [
    currentCalculation,
    userId,
    calculationNotes,
    lastSaveTimestamp,
    dailySaveCount,
  ]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Add notes to calculations</CardTitle>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <Input
          placeholder="something like potential stop losses, etc..."
          value={calculationNotes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCalculationNotes(e.target.value)
          }
          className="mb-4"
        />
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <Button
            onClick={saveCalculation}
            disabled={isSaving || !currentCalculation.results}
            type="button"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Current
              </>
            )}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default SavedCalculations;
