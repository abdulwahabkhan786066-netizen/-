import React, { useState } from 'react';
import { Language } from '../types';
import { X, Sun, Sprout, Calculator, CheckCircle2 } from 'lucide-react';

interface AgriCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AgriCalculatorModal: React.FC<AgriCalculatorModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTool, setActiveTool] = useState<'fertilizer' | 'solar'>('fertilizer');

  // Fertilizer State
  const [crop, setCrop] = useState<'wheat' | 'rice' | 'cotton' | 'maize' | 'sugarcane'>('wheat');
  const [acres, setAcres] = useState<number>(5);

  // Solar State
  const [depthFeet, setDepthFeet] = useState<number>(120);
  const [deliveryInch, setDeliveryInch] = useState<number>(4);

  if (!isOpen) return null;

  const isUrdu = language === 'ur';

  // Fertilizer calculation formula per acre
  const cropFormulas = {
    wheat: { dapPerAcre: 1.0, ureaPerAcre: 2.0, potashPerAcre: 0.5, nameUrdu: 'گندم' },
    rice: { dapPerAcre: 1.0, ureaPerAcre: 2.5, potashPerAcre: 0.5, nameUrdu: 'چاول / دھان' },
    cotton: { dapPerAcre: 1.5, ureaPerAcre: 3.0, potashPerAcre: 1.0, nameUrdu: 'کپاس' },
    maize: { dapPerAcre: 1.5, ureaPerAcre: 3.0, potashPerAcre: 1.0, nameUrdu: 'مکئی' },
    sugarcane: { dapPerAcre: 2.0, ureaPerAcre: 4.0, potashPerAcre: 1.5, nameUrdu: 'گنا' },
  };

  const selectedFormula = cropFormulas[crop];
  const dapBags = Math.round(selectedFormula.dapPerAcre * acres * 10) / 10;
  const ureaBags = Math.round(selectedFormula.ureaPerAcre * acres * 10) / 10;
  const potashBags = Math.round(selectedFormula.potashPerAcre * acres * 10) / 10;
  const estFertilizerCost = dapBags * 12400 + ureaBags * 4650 + potashBags * 13500;

  // Solar sizing formula
  // Rough rule of thumb for agri tubewell in Indus plains:
  // HP depends on depth and flow rate (gallons/min)
  // HP = (Flow GPM * Head ft) / 3960 * efficiency factor
  let recHP = 7.5;
  if (depthFeet <= 80) recHP = deliveryInch <= 4 ? 7.5 : 10;
  else if (depthFeet <= 140) recHP = deliveryInch <= 4 ? 12.5 : 15;
  else if (depthFeet <= 200) recHP = deliveryInch <= 4 ? 15 : 20;
  else recHP = 25;

  const reqKW = Math.round(recHP * 0.746 * 1.35 * 10) / 10; // with 35% PV oversize margin
  const panelCount580W = Math.ceil((reqKW * 1000) / 580);
  const approxWaterOutputGPM = Math.round(deliveryInch === 3 ? 180 : deliveryInch === 4 ? 320 : deliveryInch === 5 ? 550 : 750);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className={`text-lg sm:text-xl font-bold ${isUrdu ? 'urdu-font' : ''}`}>
                {isUrdu ? 'زرعی تخمینہ کار (کیلکولیٹر)' : 'Agri Smart Calculators'}
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {isUrdu ? 'کھاد کی مقدار اور سولر ٹیوب ویل کا سائنسی تخمینہ' : 'Fertilizer requirements & Solar Tube Well capacity'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-50 p-2 gap-2 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTool('fertilizer')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTool === 'fertilizer'
                ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{isUrdu ? 'کھاد کی ضرورت کا تخمینہ' : 'Fertilizer Calculator'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('solar')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTool === 'solar'
                ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{isUrdu ? 'سولر ٹیوب ویل تخمینہ' : 'Solar Pump Sizer'}</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
          {activeTool === 'fertilizer' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isUrdu ? 'فصل کا انتخاب کریں:' : 'Select Crop:'}
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="wheat">{isUrdu ? 'گندم (Wheat)' : 'Wheat'}</option>
                    <option value="rice">{isUrdu ? 'دھان / چاول (Rice/Paddy)' : 'Rice / Paddy'}</option>
                    <option value="cotton">{isUrdu ? 'کپاس (Cotton)' : 'Cotton'}</option>
                    <option value="maize">{isUrdu ? 'مکئی (Corn/Maize)' : 'Corn / Maize'}</option>
                    <option value="sugarcane">{isUrdu ? 'کماد / گنا (Sugarcane)' : 'Sugarcane'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isUrdu ? 'رقبہ (ایکڑ میں):' : 'Land Area (Acres):'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={acres}
                    onChange={(e) => setAcres(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 tabular-nums"
                  />
                </div>
              </div>

              {/* Results Box */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isUrdu
                      ? `${acres} ایکڑ ${selectedFormula.nameUrdu} کے لیے تجویز کردہ کھاد:`
                      : `Recommended fertilizer for ${acres} acres of ${crop}:`}
                  </span>
                </h4>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="text-stone-500 text-[11px]">{isUrdu ? 'ڈی اے پی (DAP)' : 'DAP Bags'}</div>
                    <div className="text-lg font-bold text-stone-900 tabular-nums">{dapBags}</div>
                    <div className="text-[10px] text-stone-400">{isUrdu ? 'تھیلے (50 کلو)' : '50kg bags'}</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="text-stone-500 text-[11px]">{isUrdu ? 'یوریا (Urea)' : 'Urea Bags'}</div>
                    <div className="text-lg font-bold text-stone-900 tabular-nums">{ureaBags}</div>
                    <div className="text-[10px] text-stone-400">{isUrdu ? 'تھیلے (50 کلو)' : '50kg bags'}</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="text-stone-500 text-[11px]">{isUrdu ? 'پوٹاش (Potash)' : 'Potash (SOP)'}</div>
                    <div className="text-lg font-bold text-stone-900 tabular-nums">{potashBags}</div>
                    <div className="text-[10px] text-stone-400">{isUrdu ? 'تھیلے (50 کلو)' : '50kg bags'}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-stone-600 font-medium">
                    {isUrdu ? 'موجودہ منڈی ریٹ کے مطابق کل تخمینہ لاگت:' : 'Estimated Total Fertilizer Budget:'}
                  </span>
                  <span className="font-extrabold text-emerald-950 tabular-nums text-base">
                    Rs. {estFertilizerCost.toLocaleString('en-PK')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isUrdu ? 'زیرِ زمین پانی کی گہرائی (فٹ میں):' : 'Water Table Depth (Feet):'}
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={400}
                    step={10}
                    value={depthFeet}
                    onChange={(e) => setDepthFeet(Math.max(20, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isUrdu ? 'ڈلیوری پائپ سائز (انچ میں):' : 'Delivery Pipe Diameter (Inches):'}
                  </label>
                  <select
                    value={deliveryInch}
                    onChange={(e) => setDeliveryInch(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value={3}>3 {isUrdu ? 'انچ' : 'Inches'}</option>
                    <option value={4}>4 {isUrdu ? 'انچ (معیاری)' : 'Inches (Standard)'}</option>
                    <option value={5}>5 {isUrdu ? 'انچ (بڑا ٹیوب ویل)' : 'Inches (Large)'}</option>
                    <option value={6}>6 {isUrdu ? 'انچ (کمرشل)' : 'Inches (Heavy)'}</option>
                  </select>
                </div>
              </div>

              {/* Sizing Recommendations */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>
                    {isUrdu
                      ? `${depthFeet} فٹ گہرائی اور ${deliveryInch} انچ ڈلیوری کے لیے مطلوبہ سسٹم:`
                      : `Recommended Solar Setup for ${depthFeet}ft head:`}
                  </span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                    <div className="text-stone-500 text-[11px]">{isUrdu ? 'موٹر کی طاقت' : 'Motor Power'}</div>
                    <div className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">{recHP} HP</div>
                    <div className="text-[10px] text-stone-400">{isUrdu ? 'سبمرسیبل پمپ' : 'Submersible'}</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                    <div className="text-stone-500 text-[11px]">{isUrdu ? 'سولر پلیٹیں (580W)' : '580W Panels'}</div>
                    <div className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">{panelCount580W}</div>
                    <div className="text-[10px] text-stone-400">{isUrdu ? 'عدد پلیٹیں' : 'Bifacial Units'}</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                    <div className="text-stone-500 text-[11px]">{isUrdu ? 'سولر انورٹر گنجائش' : 'Inverter KW'}</div>
                    <div className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">{reqKW} kW</div>
                    <div className="text-[10px] text-stone-400">{isUrdu ? 'وی ایف ڈی VFD' : 'VFD Drive'}</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                    <div className="text-stone-500 text-[11px]">{isUrdu ? 'متوقع پانی کا اخراج' : 'Water Flow'}</div>
                    <div className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">{approxWaterOutputGPM}</div>
                    <div className="text-[10px] text-stone-400">{isUrdu ? 'گیلن فی منٹ' : 'Gallons/min'}</div>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 pt-2 border-t border-amber-200/60 leading-relaxed">
                  {isUrdu
                    ? 'یہ تخمینہ پاکستان کونسل برائے ریسرچ ان واٹر ریسورسز (PCRWR) اور معیاری اریگیشن اصولوں پر مبنی ہے۔'
                    : 'Calculation accounts for 35% PV sizing margin to handle morning/evening solar hours.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
