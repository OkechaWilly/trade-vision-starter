import { supabase } from "@/lib/supabaseClient";

export interface SecurityEvent {
  event_type: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'password_reset' | 'trade_created' | 'trade_updated' | 'trade_deleted' | 'unauthorized_access';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityLogger {
  private async getClientInfo() {
    const userAgent = navigator.userAgent;
    
    // Get IP address from a public service (fallback)
    let ipAddress = 'unknown';
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ipAddress = data.ip;
    } catch (error) {
      // Fallback to unknown if IP detection fails
      console.warn('Could not detect IP address');
    }

    return { userAgent, ipAddress };
  }

  async log(event: Omit<SecurityEvent, 'ip_address' | 'user_agent'>) {
    try {
      const { userAgent, ipAddress } = await this.getClientInfo();
      
      const securityEvent: SecurityEvent = {
        ...event,
        ip_address: ipAddress,
        user_agent: userAgent,
      };

      // Log to Supabase (requires security_logs table)
      const { error } = await supabase
        .from('security_logs')
        .insert({
          event_type: securityEvent.event_type,
          user_id: securityEvent.user_id,
          ip_address: securityEvent.ip_address,
          user_agent: securityEvent.user_agent,
          metadata: securityEvent.metadata || {},
          severity: securityEvent.severity,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Failed to log security event:', error);
        // Fallback to console logging
        console.log('Security Event:', securityEvent);
      }
    } catch (error) {
      console.error('Security logging failed:', error);
      // Always log to console as fallback
      console.log('Security Event (fallback):', event);
    }
  }

  // Convenience methods for common events
  async logLogin(userId: string, success: boolean, metadata?: Record<string, any>) {
    await this.log({
      event_type: success ? 'login_success' : 'login_failure',
      user_id: userId,
      metadata,
      severity: success ? 'low' : 'medium',
    });
  }

  async logLogout(userId: string) {
    await this.log({
      event_type: 'logout',
      user_id: userId,
      severity: 'low',
    });
  }

  async logPasswordReset(email: string) {
    await this.log({
      event_type: 'password_reset',
      metadata: { email },
      severity: 'medium',
    });
  }

  async logTradeAction(userId: string, action: 'created' | 'updated' | 'deleted', tradeId?: string) {
    const eventType = `trade_${action}` as SecurityEvent['event_type'];
    await this.log({
      event_type: eventType,
      user_id: userId,
      metadata: { trade_id: tradeId },
      severity: 'low',
    });
  }

  async logUnauthorizedAccess(metadata?: Record<string, any>) {
    await this.log({
      event_type: 'unauthorized_access',
      metadata,
      severity: 'high',
    });
  }
}

export const securityLogger = new SecurityLogger();