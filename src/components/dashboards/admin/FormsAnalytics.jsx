import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaCalendarAlt,
  FaFileAlt,
  FaSearch
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { inspectionFormAPI } from '../../services/api';

const FormsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    formCounts: {
      total: 0,
      approved: 0,
      rejected: 0,
      pending: 0,
      draft: 0
    },
    monthlyData: [],
    formsByProduct: [],
    approvalTimeData: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all forms
      const allForms = await inspectionFormAPI.getAllForms();
      
      // Process data for analytics
      processAnalyticsData(allForms);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (forms) => {
    // Count forms by status
    const formCounts = {
      total: forms.length,
      approved: forms.filter(form => form.status === 'APPROVED').length,
      rejected: forms.filter(form => form.status === 'REJECTED').length,
      pending: forms.filter(form => form.status === 'SUBMITTED').length,
      draft: forms.filter(form => form.status === 'DRAFT').length
    };

    // Process monthly data based on selected timeframe
    const monthlyData = generateTimeSeriesData(forms, timeframe);
    
    // Group forms by product
    const productGroups = {};
    forms.forEach(form => {
      const product = form.product || 'Unspecified';
      if (!productGroups[product]) {
        productGroups[product] = {
          name: product,
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0
        };
      }
      
      productGroups[product].total += 1;
      
      if (form.status === 'APPROVED') {
        productGroups[product].approved += 1;
      } else if (form.status === 'REJECTED') {
        productGroups[product].rejected += 1;
      } else if (form.status === 'SUBMITTED') {
        productGroups[product].pending += 1;
      }
    });
    
    const formsByProduct = Object.values(productGroups);

    // Calculate approval time data
    const approvalTimeData = calculateApprovalTimeData(forms);

    setAnalyticsData({
      formCounts,
      monthlyData,
      formsByProduct,
      approvalTimeData
    });
  };

  const generateTimeSeriesData = (forms, timeframe) => {
    const now = new Date();
    let data = [];
    let dateFormat;
    let periodCount;
    
    switch(timeframe) {
      case 'week':
        dateFormat = (date) => `Day ${date.getDate()}`;
        periodCount = 7;
        break;
      case 'year':
        dateFormat = (date) => date.toLocaleString('default', { month: 'short' });
        periodCount = 12;
        break;
      case 'month':
      default:
        dateFormat = (date) => `Day ${date.getDate()}`;
        periodCount = 30;
        break;
    }

    // Create periods
    for (let i = 0; i < periodCount; i++) {
      const date = new Date();
      
      if (timeframe === 'week') {
        date.setDate(now.getDate() - (periodCount - 1 - i));
      } else if (timeframe === 'month') {
        date.setDate(now.getDate() - (periodCount - 1 - i));
      } else if (timeframe === 'year') {
        date.setMonth(now.getMonth() - (periodCount - 1 - i));
      }
      
      const period = {
        name: dateFormat(date),
        submitted: 0,
        approved: 0,
        rejected: 0,
        date: date
      };
      
      data.push(period);
    }

    // Populate with form data
    forms.forEach(form => {
      if (form.submittedAt) {
        const submittedDate = new Date(form.submittedAt);
        data.forEach(period => {
          if (isSamePeriod(submittedDate, period.date, timeframe)) {
            period.submitted += 1;
          }
        });
      }
      
      if (form.reviewedAt) {
        const reviewedDate = new Date(form.reviewedAt);
        data.forEach(period => {
          if (isSamePeriod(reviewedDate, period.date, timeframe)) {
            if (form.status === 'APPROVED') {
              period.approved += 1;
            } else if (form.status === 'REJECTED') {
              period.rejected += 1;
            }
          }
        });
      }
    });

    return data;
  };

  const isSamePeriod = (date1, date2, timeframe) => {
    if (timeframe === 'week' || timeframe === 'month') {
      return date1.getDate() === date2.getDate() && 
             date1.getMonth() === date2.getMonth() && 
             date1.getFullYear() === date2.getFullYear();
    } else if (timeframe === 'year') {
      return date1.getMonth() === date2.getMonth() && 
             date1.getFullYear() === date2.getFullYear();
    }
    return false;
  };

  const calculateApprovalTimeData = (forms) => {
    const approvedForms = forms.filter(form => 
      form.status === 'APPROVED' && form.submittedAt && form.reviewedAt
    );
    
    // Group by time ranges
    const timeRanges = [
      { name: '< 1 hour', count: 0 },
      { name: '1-4 hours', count: 0 },
      { name: '4-24 hours', count: 0 },
      { name: '1-3 days', count: 0 },
      { name: '> 3 days', count: 0 }
    ];
    
    approvedForms.forEach(form => {
      const submittedTime = new Date(form.submittedAt).getTime();
      const reviewedTime = new Date(form.reviewedAt).getTime();
      const diffHours = (reviewedTime - submittedTime) / (1000 * 60 * 60);
      
      if (diffHours < 1) {
        timeRanges[0].count++;
      } else if (diffHours < 4) {
        timeRanges[1].count++;
      } else if (diffHours < 24) {
        timeRanges[2].count++;
      } else if (diffHours < 72) {
        timeRanges[3].count++;
      } else {
        timeRanges[4].count++;
      }
    });
    
    return timeRanges;
  };

  // Color configuration
  const COLORS = {
    approved: '#34D399', // green
    rejected: '#F87171', // red
    pending: '#60A5FA', // blue
    draft: '#D1D5DB',   // gray
    total: '#8B5CF6'     // purple
  };
  
  const PIECHART_COLORS = ['#34D399', '#F87171', '#60A5FA', '#D1D5DB'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center">
          <FaChartLine className="mr-2 text-blue-600" />
          Forms Analytics Dashboard
        </h2>
        
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-md ${timeframe === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${timeframe === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${timeframe === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Forms Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Total Forms</p>
              <p className="text-2xl font-bold">{analyticsData.formCounts.total}</p>
            </div>
            <div className="p-2 bg-white bg-opacity-30 rounded-md">
              <FaFileAlt size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Approved</p>
              <p className="text-2xl font-bold">{analyticsData.formCounts.approved}</p>
            </div>
            <div className="p-2 bg-white bg-opacity-30 rounded-md">
              <FaCheckCircle size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Rejected</p>
              <p className="text-2xl font-bold">{analyticsData.formCounts.rejected}</p>
            </div>
            <div className="p-2 bg-white bg-opacity-30 rounded-md">
              <FaTimesCircle size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Pending</p>
              <p className="text-2xl font-bold">{analyticsData.formCounts.pending}</p>
            </div>
            <div className="p-2 bg-white bg-opacity-30 rounded-md">
              <FaHourglassHalf size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Draft</p>
              <p className="text-2xl font-bold">{analyticsData.formCounts.draft}</p>
            </div>
            <div className="p-2 bg-white bg-opacity-30 rounded-md">
              <FaFileAlt size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Status Distribution */}
      <div className="bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Form Status Distribution</h3>
        <div className="flex flex-col md:flex-row items-center justify-around">
          <div className="w-80 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Approved', value: analyticsData.formCounts.approved },
                    { name: 'Rejected', value: analyticsData.formCounts.rejected },
                    { name: 'Pending', value: analyticsData.formCounts.pending },
                    { name: 'Draft', value: analyticsData.formCounts.draft }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {[
                    { name: 'Approved', value: analyticsData.formCounts.approved },
                    { name: 'Rejected', value: analyticsData.formCounts.rejected },
                    { name: 'Pending', value: analyticsData.formCounts.pending },
                    { name: 'Draft', value: analyticsData.formCounts.draft }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIECHART_COLORS[index % PIECHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3 mt-4 md:mt-0">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400 rounded-sm mr-2"></div>
              <span>Approved: {analyticsData.formCounts.approved} forms ({analyticsData.formCounts.total > 0 ? ((analyticsData.formCounts.approved / analyticsData.formCounts.total) * 100).toFixed(1) : 0}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-400 rounded-sm mr-2"></div>
              <span>Rejected: {analyticsData.formCounts.rejected} forms ({analyticsData.formCounts.total > 0 ? ((analyticsData.formCounts.rejected / analyticsData.formCounts.total) * 100).toFixed(1) : 0}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-400 rounded-sm mr-2"></div>
              <span>Pending: {analyticsData.formCounts.pending} forms ({analyticsData.formCounts.total > 0 ? ((analyticsData.formCounts.pending / analyticsData.formCounts.total) * 100).toFixed(1) : 0}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded-sm mr-2"></div>
              <span>Draft: {analyticsData.formCounts.draft} forms ({analyticsData.formCounts.total > 0 ? ((analyticsData.formCounts.draft / analyticsData.formCounts.total) * 100).toFixed(1) : 0}%)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Forms Activity Timeline */}
      <div className="bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Forms Activity Timeline</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analyticsData.monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="submitted" 
                name="Submitted" 
                stroke="#8B5CF6" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="approved" 
                name="Approved" 
                stroke="#34D399" 
              />
              <Line 
                type="monotone" 
                dataKey="rejected" 
                name="Rejected" 
                stroke="#F87171" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Approval Time Distribution */}
      <div className="bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Approval Time Distribution</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analyticsData.approvalTimeData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Forms Approved" 
                fill="#60A5FA" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Forms by Product */}
      <div className="bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Forms by Product</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Total Forms</th>
                <th className="p-2 text-left">Approved</th>
                <th className="p-2 text-left">Rejected</th>
                <th className="p-2 text-left">Pending</th>
                <th className="p-2 text-left">Approval Rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.formsByProduct.map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2 font-medium">{product.name}</td>
                  <td className="p-2">{product.total}</td>
                  <td className="p-2 text-green-600">{product.approved}</td>
                  <td className="p-2 text-red-600">{product.rejected}</td>
                  <td className="p-2 text-blue-600">{product.pending}</td>
                  <td className="p-2">
                    {product.approved > 0 ? 
                      `${((product.approved / (product.approved + product.rejected)) * 100).toFixed(1)}%` : 
                      '0%'
                    }
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ 
                          width: `${product.approved > 0 ? 
                            ((product.approved / (product.approved + product.rejected)) * 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 italic text-right">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default FormsAnalytics;