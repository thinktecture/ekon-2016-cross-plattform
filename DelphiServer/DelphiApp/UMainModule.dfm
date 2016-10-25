object MainModule: TMainModule
  OldCreateOrder = False
  OnCreate = DataModuleCreate
  Height = 356
  Width = 476
  object srvMain: TIdHTTPServer
    Active = True
    Bindings = <>
    DefaultPort = 8000
    AutoStartSession = True
    KeepAlive = True
    OnCommandOther = OnSrvMainCommand
    OnCommandGet = OnSrvMainCommand
    Left = 144
    Top = 16
  end
  object SqliteConnection: TZConnection
    ControlsCodePage = cCP_UTF16
    Catalog = 'quotes'
    Connected = True
    AfterConnect = SqliteConnectionAfterConnect
    HostName = ''
    Port = 0
    Database = 'quotesdb.sqlite'
    User = ''
    Password = ''
    Protocol = 'sqlite-3'
    Left = 56
    Top = 72
  end
  object tblQuotes: TZTable
    Connection = SqliteConnection
    AfterInsert = tblQuotesAfterInsert
    TableName = 'quotes'
    Left = 56
    Top = 128
  end
  object dtsQuotes: TDataSource
    DataSet = tblQuotes
    Left = 56
    Top = 192
  end
  object qryRandomQuote: TZReadOnlyQuery
    Connection = SqliteConnection
    SQL.Strings = (
      'SELECT id, quote, source FROM quotes ORDER BY RANDOM() LIMIT 1;')
    Params = <>
    Left = 144
    Top = 128
  end
  object qryLoadAllQuotes: TZReadOnlyQuery
    Connection = SqliteConnection
    SQL.Strings = (
      'SELECT id, quote, source FROM quotes;')
    Params = <>
    Left = 144
    Top = 192
  end
  object qryDeleteQuote: TZQuery
    Connection = SqliteConnection
    SQL.Strings = (
      'DELETE FROM quotes WHERE id = :quoteId;')
    Params = <
      item
        DataType = ftWideString
        Name = 'quoteId'
        ParamType = ptInput
      end>
    Left = 144
    Top = 248
    ParamData = <
      item
        DataType = ftWideString
        Name = 'quoteId'
        ParamType = ptInput
      end>
  end
  object qryAddQuote: TZReadOnlyQuery
    Connection = SqliteConnection
    SQL.Strings = (
      
        'INSERT INTO quotes (id, quote, source) VALUES (:id, :quote, :sou' +
        'rce);')
    Params = <
      item
        DataType = ftString
        Name = 'id'
        ParamType = ptInput
      end
      item
        DataType = ftString
        Name = 'quote'
        ParamType = ptInput
      end
      item
        DataType = ftString
        Name = 'source'
        ParamType = ptInput
      end>
    Left = 144
    Top = 304
    ParamData = <
      item
        DataType = ftString
        Name = 'id'
        ParamType = ptInput
      end
      item
        DataType = ftString
        Name = 'quote'
        ParamType = ptInput
      end
      item
        DataType = ftString
        Name = 'source'
        ParamType = ptInput
      end>
  end
end
