import React from 'react'

function CharacteristicsTable({ 
  formData, 
  handleCharChange, 
  permissions, 
  formType 
}) {
  // Adjust heading based on form type
  const getObservationHeader = () => {
    switch(formType) {
      case 'coating':
        return 'As per Reference sample no. X-211';
      case 'printing':
        return 'As per reference sample no. X-100';
      default:
        return 'Observations';
    }
  };

  return (
    <div className="mt-px">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-800 p-2 w-12 bg-gray-200">S.No.</th>
            <th className="border border-gray-800 p-2 bg-gray-200">Characteristic</th>
            <th className="border border-gray-800 p-2 bg-gray-200">
              <div>{getObservationHeader()}</div>
              <div>Observations</div>
            </th>
            <th className="border border-gray-800 p-2 bg-gray-200">Comments</th>
          </tr>
        </thead>
        <tbody>
          {formData?.characteristics?.map((char, index) => (
            <tr key={char.id}>
              <td className="border border-gray-800 p-2 text-center">{char.id}</td>
              <td className="border border-gray-800 p-2">
                <input
                  type="text"
                  value={char.name}
                  onChange={(e) => handleCharChange(index, 'name', e.target.value)}
                  disabled={!permissions?.canEditCharacteristics}
                  className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </td>
              <td className="border border-gray-800">
                {char.name === 'Printing Position' || char.name === 'Coating Thickness' ? (
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border-b border-r border-gray-800 p-2 w-30 text-center font-semibold h-12">
                          {char.name === 'Printing Position' ? 'Vertical ± 1.0mm' : 'Body'}
                        </td>
                        <td className="border-b border-gray-800 p-2 text-center h-12">
                          <input
                            type="text"
                            value={char.name === 'Printing Position' ? char.vertical : char.bodyThickness}
                            onChange={(e) => handleCharChange(index, char.name === 'Printing Position' ? 'vertical' : 'bodyThickness', e.target.value)}
                            disabled={!permissions?.canEditCharacteristics}
                            className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder={char.name === 'Printing Position' ? 'Enter measurement' : ''}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-gray-800 text-center font-semibold h-12">
                          {char.name === 'Printing Position' ? 'Horizontal ± 1.0mm' : 'Bottom'}
                        </td>
                        <td className="p-2 text-center h-12">
                          <input
                            type="text"
                            value={char.name === 'Printing Position' ? char.horizontal : char.bottomThickness}
                            onChange={(e) => handleCharChange(index, char.name === 'Printing Position' ? 'horizontal' : 'bottomThickness', e.target.value)}
                            disabled={!permissions?.canEditCharacteristics}
                            className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder={char.name === 'Printing Position' ? 'Enter measurement' : ''}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <input
                    type="text"
                    value={char.observation}
                    onChange={(e) => handleCharChange(index, 'observation', e.target.value)}
                    disabled={!permissions?.canEditCharacteristics}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                )}
              </td>
              <td className="border border-gray-800 p-2">
                <input
                  type="text"
                  value={char.comments}
                  onChange={(e) => handleCharChange(index, 'comments', e.target.value)}
                  disabled={!permissions?.canEditCharacteristics}
                  className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CharacteristicsTable