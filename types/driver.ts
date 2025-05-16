// driver.ts


 //geographical coordinates.
  export interface GeoLocation {
      latitude: number;  
      longitude: number; 
}
  
  export enum DriverStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    DELIVERY = "DELIVERY",
  }
  
  
  export interface Driver {
    driverId: string;        
    name: string;            
    status: DriverStatus;    
    available: boolean;      
    driverLocation: GeoLocation; 
  }
  
  // Example Usage (optional, for demonstration):
  /*
  const sampleDriver: Driver = {
    driverId: "d12345",
    name: "John Doe",
    status: DriverStatus.ONLINE,
    available: true,
    driverLocation: {
      latitude: 6.9271,
      longitude: 79.8612,
    },
  };
  
  console.log(sampleDriver);
  */
  