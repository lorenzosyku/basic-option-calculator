// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from '../../../../lib/firebase';

interface FilingUrls {
  view_url: string;
  interactive_url: string;
}

interface DataEntry {
  end: string;
  val: number;
  filed: string;
  form: string;
  fy: number;
  fp: string;
  accn: string;
  filing_urls: FilingUrls;
}

interface UnitsData {
  shares: DataEntry[];
}

interface SecData {
  description: string;
  units: UnitsData;
}

export default function HomePage() {
  const [secData, setSecData] = useState<SecData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
 

  async function getSecData(currentUser: User): Promise<SecData | null> {
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }

    try {
      const docRef = doc(db, 'sec_data_0001838359', 'Entity Common Stock, Shares Outstanding');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as SecData;
        
        return data;
      } else {
        console.log('No such document exists!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching SEC data:', error);
      throw error;
    }
  }

  async function fetchData(currentUser: User) {
    try {
      const data = await getSecData(currentUser);
      setSecData(data);

    } catch (err) {
      setError('Error fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(true); // Reset loading state when auth state changes
      
      if (currentUser) {
        fetchData(currentUser);
      } else {
        setLoading(false);
        setError('Please sign in to access this data');
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in to view this data</div>;
  if (error) return <div>Error: {error}</div>;
  if (!secData) return <div>No data found</div>;

  const usdEntries = secData.units.shares ;
 

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SEC Data</h1>
      <p className="mb-4">Description: {secData.description}</p>
      <div className="space-y-4">
        {usdEntries.map((entry: DataEntry, index: number) => (
          <div key={`${entry.end}-${entry.accn}`} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Entry {index + 1}</h2>
            <p>End Date: {entry.end}</p>
            <p>Value: {entry.val.toLocaleString()}</p>
            <p>Filed Date: {entry.filed}</p>
            <p>Form: {entry.form}</p>
            <p>View URL: {entry.filing_urls.view_url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}