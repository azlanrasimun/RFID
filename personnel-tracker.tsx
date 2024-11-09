import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Home, Warehouse, AlertCircle, Globe, AlertTriangle } from 'lucide-react';

// Language translations
const translations = {
  en: {
    title: "Offshore Personnel Tracking System",
    totalPersonnel: "Total Personnel",
    inQuarters: "In Living Quarters",
    onDeck: "At Cellar Deck",
    onDuty: "On Duty",
    allLocations: "All Locations",
    quarters: "Living Quarters",
    deck: "Cellar Deck",
    personnelStatus: "Personnel Status",
    name: "Name",
    role: "Role",
    location: "Location",
    status: "Status",
    emergency: "Emergency Mode",
    normal: "Normal Mode",
    musterStation: "Muster Station",
    notMustered: "Not Mustered",
    mustered: "Mustered",
    missingPersonnel: "Missing Personnel",
    atMuster: "Personnel at Muster Points",
    switchToEmergency: "Switch to Emergency Mode",
    switchToNormal: "Return to Normal Mode",
    musterStationA: "Muster Station A",
    musterStationB: "Muster Station B",
  },
  my: {
    title: "Sistem Penjejakan Kakitangan Luar Pesisir",
    totalPersonnel: "Jumlah Kakitangan",
    inQuarters: "Di Kuarters",
    onDeck: "Di Dek Selari",
    onDuty: "Sedang Bertugas",
    allLocations: "Semua Lokasi",
    quarters: "Kuarters",
    deck: "Dek Selari",
    personnelStatus: "Status Kakitangan",
    name: "Nama",
    role: "Jawatan",
    location: "Lokasi",
    status: "Status",
    emergency: "Mod Kecemasan",
    normal: "Mod Biasa",
    musterStation: "Stesen Berkumpul",
    notMustered: "Belum Berkumpul",
    mustered: "Sudah Berkumpul",
    missingPersonnel: "Kakitangan Hilang",
    atMuster: "Kakitangan di Tempat Berkumpul",
    switchToEmergency: "Tukar ke Mod Kecemasan",
    switchToNormal: "Kembali ke Mod Biasa",
    musterStationA: "Stesen Berkumpul A",
    musterStationB: "Stesen Berkumpul B",
  }
};

// Expanded personnel data with muster station assignments
const initialPersonnel = [
  { id: 1, name: "Ahmad bin Ismail", role: "Jurugerudian", location: "Living Quarters", status: "On Shift", musterStation: "A" },
  { id: 2, name: "Siti Nurul Aina", role: "Jurutera Petroleum", location: "Cellar Deck", status: "Working", musterStation: "B" },
  // ... previous personnel entries ... 
  { id: 15, name: "Zahid bin Mustafa", role: "Jurutera Subsea", location: "Cellar Deck", status: "Working", musterStation: "A" }
].map(person => ({
  ...person,
  mustered: false, // Add mustered status to each person
  lastKnownLocation: person.location // Track last known location
}));

const PersonnelTracker = () => {
  const [personnel, setPersonnel] = useState(initialPersonnel);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [timeNow, setTimeNow] = useState(new Date().toLocaleTimeString());
  const [language, setLanguage] = useState('en');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const t = translations[language];

  // Simulate personnel movement in normal mode
  useEffect(() => {
    let interval;
    if (!isEmergencyMode) {
      interval = setInterval(() => {
        setPersonnel(prev => prev.map(person => {
          if (Math.random() > 0.7) {
            const newLocation = person.location === "Living Quarters" ? "Cellar Deck" : "Living Quarters";
            const newStatus = ["Working", "On Break", "On Shift", "Off Shift"][Math.floor(Math.random() * 4)];
            return { 
              ...person, 
              location: newLocation, 
              status: newStatus,
              lastKnownLocation: newLocation 
            };
          }
          return person;
        }));
        setTimeNow(new Date().toLocaleTimeString());
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isEmergencyMode]);

  // Emergency mode simulation - randomly update mustering status
  useEffect(() => {
    let interval;
    if (isEmergencyMode) {
      interval = setInterval(() => {
        setPersonnel(prev => prev.map(person => {
          if (!person.mustered && Math.random() > 0.7) {
            return { ...person, mustered: true, location: `Muster Station ${person.musterStation}` };
          }
          return person;
        }));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isEmergencyMode]);

  const toggleEmergencyMode = () => {
    setIsEmergencyMode(!isEmergencyMode);
    if (!isEmergencyMode) {
      // Reset mustering status when entering emergency mode
      setPersonnel(prev => prev.map(person => ({
        ...person,
        mustered: false,
        location: person.lastKnownLocation
      })));
    }
  };

  const getStatusColor = (status) => {
    if (isEmergencyMode) {
      return status ? 'bg-green-500' : 'bg-red-500';
    }
    switch(status) {
      case 'Working': return 'bg-green-500';
      case 'On Break': return 'bg-yellow-500';
      case 'On Shift': return 'bg-blue-500';
      case 'Off Shift': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const EmergencyHeader = () => (
    <div className="bg-red-500 p-4 mb-6 rounded-lg text-white flex justify-between items-center">
      <div className="flex items-center">
        <AlertTriangle className="h-8 w-8 mr-2" />
        <span className="text-2xl font-bold">{t.emergency}</span>
      </div>
      <button
        onClick={toggleEmergencyMode}
        className="bg-white text-red-500 px-4 py-2 rounded hover:bg-red-100"
      >
        {t.switchToNormal}
      </button>
    </div>
  );

  const NormalHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{t.title}</h1>
      <div className="flex gap-4">
        <button
          onClick={() => setLanguage(language === 'en' ? 'my' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          <Globe className="h-4 w-4" />
          {language === 'en' ? 'Bahasa Malaysia' : 'English'}
        </button>
        <button
          onClick={toggleEmergencyMode}
          className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          <AlertTriangle className="h-4 w-4" />
          {t.switchToEmergency}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {isEmergencyMode ? <EmergencyHeader /> : <NormalHeader />}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isEmergencyMode ? (
          <>
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">{t.totalPersonnel}</p>
                  <p className="text-2xl font-bold">{personnel.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-4 bg-green-50">
                <AlertCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">{t.mustered}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {personnel.filter(p => p.mustered).length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-4 bg-red-50">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">{t.notMustered}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {personnel.filter(p => !p.mustered).length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">{t.totalPersonnel}</p>
                  <p className="text-2xl font-bold">{personnel.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <Home className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">{t.inQuarters}</p>
                  <p className="text-2xl font-bold">
                    {personnel.filter(p => p.location === "Living Quarters").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <Warehouse className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">{t.onDeck}</p>
                  <p className="text-2xl font-bold">
                    {personnel.filter(p => p.location === "Cellar Deck").length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Personnel Table */}
      <Card>
        <CardHeader>
          <CardTitle>{isEmergencyMode ? t.missingPersonnel : t.personnelStatus}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">{t.name}</th>
                  <th className="py-2 px-4 text-left">{t.role}</th>
                  <th className="py-2 px-4 text-left">{t.location}</th>
                  <th className="py-2 px-4 text-left">
                    {isEmergencyMode ? t.musterStation : t.status}
                  </th>
                </tr>
              </thead>
              <tbody>
                {personnel
                  .filter(person => isEmergencyMode ? !person.mustered : true)
                  .map(person => (
                    <tr key={person.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{person.name}</td>
                      <td className="py-2 px-4">{person.role}</td>
                      <td className="py-2 px-4">
                        <span className="flex items-center">
                          {isEmergencyMode ? (
                            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                          ) : person.location === "Living Quarters" ? (
                            <Home className="h-4 w-4 mr-2" />
                          ) : (
                            <Warehouse className="h-4 w-4 mr-2" />
                          )}
                          {person.location}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusColor(isEmergencyMode ? person.mustered : person.status)
                        } text-white`}>
                          {isEmergencyMode ? 
                            (person.mustered ? t.mustered : t.notMustered) : 
                            person.status
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonnelTracker;
