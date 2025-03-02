import React, { useState, useEffect } from 'react';

const SparuKalkulators = () => {
  const [input, setInput] = useState({
    laidums: 5,
    jumtaSlipums: 14,
    sparuSolis: 0.9,
    jumtaSegums: 'eternits',
    sniegaZona: 'videja',
    papildusSlodze: 'nav'
  });
  
  const [rezultats, setRezultats] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const jumtaSegumi = [
    { 
      id: 'eternits', 
      nosaukums: 'Eternīta loksnes', 
      svars: 15,
      minSlipums: 12,
      optSlipums: '15-25',
      apraksts: 'Eternīta loksnes ir izturīgas, vieglas un ērtas uzstādīšanai. Nepieciešams vismaz 12 grādu slīpums, lai nodrošinātu ūdens noteci.'
    },
    { 
      id: 'skards', 
      nosaukums: 'Metāla/Skārda segums', 
      svars: 5,
      minSlipums: 8,
      optSlipums: '10-20',
      apraksts: 'Metāla segums ir viegls, izturīgs un ātri uzstādāms. Priekšrocība ir mazais svars, kas ļauj izmantot vieglākas konstrukcijas.'
    },
    { 
      id: 'dakstini', 
      nosaukums: 'Māla/Betona dakstiņi', 
      svars: 45,
      minSlipums: 22,
      optSlipums: '30-45',
      apraksts: 'Dakstiņi ir smags, bet ļoti izturīgs segums ar ilgu kalpošanas laiku. Dēļ lielā svara nepieciešamas izturīgākas spāres.'
    },
    { 
      id: 'bitumens', 
      nosaukums: 'Bitumena šindeļi', 
      svars: 10,
      minSlipums: 15,
      optSlipums: '20-30',
      apraksts: 'Bitumena šindeļi ir viegli un elastīgi. Tie labi noslāpē lietus troksni un ir vienkārši uzstādāmi.'
    },
    { 
      id: 'ruberoīds', 
      nosaukums: 'Ruberoid/Ruberoīds', 
      svars: 8,
      minSlipums: 5,
      optSlipums: '5-15',
      apraksts: 'Ruberoīds ir ekonomisks risinājums ar vienkāršu uzklāšanu. Piemērots arī ļoti lēzeniem jumtiem.'
    }
  ];
  
  const sniegaZonas = [
    { id: 'zema', nosaukums: 'Zema (līdz 100 kg/m²)', slodze: 100 },
    { id: 'videja', nosaukums: 'Vidēja (100-150 kg/m²)', slodze: 125 },
    { id: 'augsta', nosaukums: 'Augsta (virs 150 kg/m²)', slodze: 175 }
  ];
  
  const papildusSlodzes = [
    { id: 'nav', nosaukums: 'Nav papildus slodzes', slodze: 0 },
    { id: 'viegla', nosaukums: 'Viegla (siltumizolācija)', slodze: 10 },
    { id: 'videja', nosaukums: 'Vidēja (siltumizolācija + griestu apšuvums)', slodze: 25 },
    { id: 'smaga', nosaukums: 'Smaga (apdzīvojami bēniņi)', slodze: 50 }
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: name === 'laidums' || name === 'jumtaSlipums' || name === 'sparuSolis' 
        ? parseFloat(value) 
        : value
    }));
  };
  
  const calculateSparuIzmers = () => {
    setLoading(true);
    
    // Atliek kalkulāciju par 500ms, lai parādītu ielādes indikatoru
    setTimeout(() => {
      // Iegūst slodzes no izvēlētajām opcijām
      const segums = jumtaSegumi.find(s => s.id === input.jumtaSegums);
      const sniegs = sniegaZonas.find(s => s.id === input.sniegaZona);
      const papildus = papildusSlodzes.find(s => s.id === input.papildusSlodze);
      
      // Jumta laukuma koeficients atkarībā no slīpuma
      const slipumsRad = input.jumtaSlipums * Math.PI / 180;
      const jumtaKoef = 1 / Math.cos(slipumsRad);
      
      // Kopējā slodze uz spāri (kg/m)
      const kopSlodze = (segums.svars + sniegs.slodze + papildus.slodze) * input.sparuSolis * jumtaKoef;
      
      // Aprēķina nepieciešamo spāres augstumu
      let rekomendetsAugstums;
      let rekomendetsIzmers;
      let rekomendetsApraksts;
      let drosibasKoeficients;
      
      if (input.laidums <= 3) {
        // Maziem laidumiem
        if (kopSlodze < 150) {
          rekomendetsAugstums = 100;
          rekomendetsIzmers = "50x100";
          drosibasKoeficients = "augsts";
        } else {
          rekomendetsAugstums = 150;
          rekomendetsIzmers = "50x150";
          drosibasKoeficients = "vidējs";
        }
      } else if (input.laidums <= 4.5) {
        // Vidējiem laidumiem
        if (kopSlodze < 200) {
          rekomendetsAugstums = 150;
          rekomendetsIzmers = "50x150";
          drosibasKoeficients = "vidējs";
        } else {
          rekomendetsAugstums = 175;
          rekomendetsIzmers = "75x175";
          drosibasKoeficients = "vidējs";
        }
      } else {
        // Lieliem laidumiem (>4.5m)
        if (kopSlodze < 200) {
          rekomendetsAugstums = 175;
          rekomendetsIzmers = "50x175";
          drosibasKoeficients = "vidējs";
        } else if (kopSlodze < 300) {
          rekomendetsAugstums = 200;
          rekomendetsIzmers = "50x200";
          drosibasKoeficients = "vidējs";
        } else {
          rekomendetsAugstums = 225;
          rekomendetsIzmers = "75x225";
          drosibasKoeficients = "augsts";
        }
      }
      
      // Alternatīvi izmēri
      const alternativiIzmeri = [];
      
      if (rekomendetsAugstums < 200) {
        alternativiIzmeri.push({
          izmers: `50x${rekomendetsAugstums + 50}`,
          apraksts: "Ja ir lielāka slodze vai vēlaties lielāku drošības rezervi"
        });
      }
      
      if (input.sparuSolis > 0.7) {
        alternativiIzmeri.push({
          izmers: rekomendetsIzmers,
          solis: Math.round(input.sparuSolis * 10 - 2) / 10,
          apraksts: "Ja samazina spāru soli, var izmantot tos pašus izmērus"
        });
      }
      
      // Kopējās slodzes novērtējums
      let slodzesLimenis;
      if (kopSlodze < 150) {
        slodzesLimenis = "zema";
        rekomendetsApraksts = "Viegla konstrukcija ar standarta prasībām";
      } else if (kopSlodze < 250) {
        slodzesLimenis = "vidēja";
        rekomendetsApraksts = "Standarta konstrukcija ar samērīgu drošības rezervi";
      } else {
        slodzesLimenis = "augsta";
        rekomendetsApraksts = "Izturīga konstrukcija ar būtisku slodzi";
      }
      
      setRezultats({
        rekomendetsIzmers,
        rekomendetsAugstums,
        rekomendetsApraksts,
        drosibasKoeficients,
        alternativiIzmeri,
        kopSlodze: Math.round(kopSlodze),
        slodzesLimenis
      });
      
      setLoading(false);
    }, 500);
  };
  
  useEffect(() => {
    calculateSparuIzmers();
    
    // Pārbauda vai izvēlētais slīpums atbilst minimālajām prasībām segumam
    const segums = jumtaSegumi.find(s => s.id === input.jumtaSegums);
    if (segums && input.jumtaSlipums < segums.minSlipums) {
      // Varētu šeit parādīt kādu brīdinājumu, bet pagaidām to darām info paneļa daļā
    }
  }, [input]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 bg-blue-600 text-white py-2 rounded-lg shadow">
        Spāru Izmēra Kalkulators
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ievades parametri */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-center bg-blue-100 py-1 rounded">
            Ievadiet Parametrus
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Laidums (attālums starp sienām, m)
              </label>
              <div className="flex">
                <input
                  type="range"
                  name="laidums"
                  min="2"
                  max="7"
                  step="0.1"
                  value={input.laidums}
                  onChange={handleInputChange}
                  className="w-full mr-2"
                />
                <input
                  type="number"
                  name="laidums"
                  min="2"
                  max="7"
                  step="0.1"
                  value={input.laidums}
                  onChange={handleInputChange}
                  className="border rounded w-20 px-2 py-1 text-center"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Jumta slīpums (grādi)
              </label>
              <div className="flex">
                <input
                  type="range"
                  name="jumtaSlipums"
                  min="5"
                  max="45"
                  step="1"
                  value={input.jumtaSlipums}
                  onChange={handleInputChange}
                  className="w-full mr-2"
                />
                <input
                  type="number"
                  name="jumtaSlipums"
                  min="5"
                  max="45"
                  step="1"
                  value={input.jumtaSlipums}
                  onChange={handleInputChange}
                  className="border rounded w-20 px-2 py-1 text-center"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Spāru solis (m)
              </label>
              <div className="flex">
                <input
                  type="range"
                  name="sparuSolis"
                  min="0.6"
                  max="1.2"
                  step="0.05"
                  value={input.sparuSolis}
                  onChange={handleInputChange}
                  className="w-full mr-2"
                />
                <input
                  type="number"
                  name="sparuSolis"
                  min="0.6"
                  max="1.2"
                  step="0.05"
                  value={input.sparuSolis}
                  onChange={handleInputChange}
                  className="border rounded w-20 px-2 py-1 text-center"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Jumta seguma materiāls
              </label>
              <select
                name="jumtaSegums"
                value={input.jumtaSegums}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {jumtaSegumi.map(segums => (
                  <option key={segums.id} value={segums.id}>
                    {segums.nosaukums} ({segums.svars} kg/m²)
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Sniega slodzes zona
              </label>
              <select
                name="sniegaZona"
                value={input.sniegaZona}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {sniegaZonas.map(zona => (
                  <option key={zona.id} value={zona.id}>
                    {zona.nosaukums}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Papildus slodze
              </label>
              <select
                name="papildusSlodze"
                value={input.papildusSlodze}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {papildusSlodzes.map(slodze => (
                  <option key={slodze.id} value={slodze.id}>
                    {slodze.nosaukums}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Rezultāts */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-center bg-blue-100 py-1 rounded">
            Rekomendētie Spāru Izmēri
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : rezultats ? (
                          <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-2">Jums Nepieciešamās Spāres:</h3>
                <div className="flex items-center justify-center">
                  <div className="text-4xl font-bold text-blue-600 bg-white px-4 py-2 rounded-lg shadow">
                    {rezultats.rekomendetsIzmers} mm
                  </div>
                </div>
                <p className="mt-2 text-center text-gray-700">
                  {rezultats.rekomendetsApraksts}
                </p>
                
                {input.jumtaSlipums < jumtaSegumi.find(s => s.id === input.jumtaSegums)?.minSlipums && (
                  <div className="mt-3 p-2 bg-red-100 rounded text-center text-red-700 border border-red-300">
                    Uzmanību! Jūsu izvēlētais jumta slīpums ({input.jumtaSlipums}°) ir mazāks nekā minimālais ieteicamais slīpums 
                    ({jumtaSegumi.find(s => s.id === input.jumtaSegums)?.minSlipums}°) šim jumta segumam!
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">Kopējā slodze:</div>
                  <div className="font-medium">
                    {rezultats.kopSlodze} kg/m
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs text-white
                      ${rezultats.slodzesLimenis === 'zema' ? 'bg-green-500' : 
                        rezultats.slodzesLimenis === 'videja' ? 'bg-yellow-500' : 
                        'bg-red-500'}`}>
                      {rezultats.slodzesLimenis.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">Drošības koeficients:</div>
                  <div className="font-medium">
                    {rezultats.drosibasKoeficients}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Alternatīvi varianti:</h3>
                <ul className="space-y-2">
                  {rezultats.alternativiIzmeri.map((alt, index) => (
                    <li key={index} className="bg-gray-50 p-2 rounded">
                      {alt.solis ? (
                        <span>
                          <span className="font-medium">{alt.izmers} mm</span> ar spāru soli <span className="font-medium">{alt.solis} m</span>
                        </span>
                      ) : (
                        <span>
                          <span className="font-medium">{alt.izmers} mm</span> - {alt.apraksts}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <h4 className="font-medium">Svarīgi!</h4>
                <p className="text-sm">
                  Šis kalkulators sniedz aptuvenas rekomendācijas. Precīzam aprēķinam konsultējieties ar būvinženieri.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              Ievadiet parametrus, lai aprēķinātu rezultātu
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3 text-center bg-blue-100 py-1 rounded">Papildu Informācija</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-medium mb-1">Spāru Solis</h3>
            <p className="text-sm">
              Mazāks spāru solis (60-80 cm) ļauj izmantot mazāka izmēra spāres, bet būs nepieciešams vairāk materiāla. Lielāks solis (90-120 cm) samazina materiāla patēriņu, bet prasa lielāku spāru šķērsgriezumu.
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-medium mb-1">Jumta Segums - {jumtaSegumi.find(s => s.id === input.jumtaSegums)?.nosaukums}</h3>
            <p className="text-sm">
              {jumtaSegumi.find(s => s.id === input.jumtaSegums)?.apraksts} 
              <br/>
              <span className="font-semibold mt-1 inline-block">
                Minimālais slīpums: {jumtaSegumi.find(s => s.id === input.jumtaSegums)?.minSlipums}°
                {input.jumtaSlipums < jumtaSegumi.find(s => s.id === input.jumtaSegums)?.minSlipums && 
                  <span className="text-red-500 ml-1">(Pārāk mazs slīpums!)</span>
                }
              </span>
              <br/>
              <span className="font-semibold">
                Optimālais slīpums: {jumtaSegumi.find(s => s.id === input.jumtaSegums)?.optSlipums}°
              </span>
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-medium mb-1">Koka Kvalitāte</h3>
            <p className="text-sm">
              Aprēķins balstīts uz C24 klases kokmateriālu. Izmantojiet žāvētu, marķētu un nesošām konstrukcijām paredzētu kokmateriālu ar mitruma saturu 16-18%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparuKalkulators;